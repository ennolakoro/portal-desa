<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Carbon\Carbon;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'category' => 'Pembangunan',
                'created_at' => Carbon::now()->subDays(1),
                'author' => 'Admin Dumbayabulan',
                'views' => 1240,
                'title' => 'Peningkatan Infrastruktur Jalan Dumbayabulan: Mempercepat Akses Ekonomi Warga',
                'excerpt' => 'Pemerintah Dumbayabulan secara resmi memulai proyek pengaspalan jalan sepanjang 2,5 kilometer yang menghubungkan dusun tengah dengan area perkebunan warga.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfbs4qfgr6roztnAOkT8OuJuNAt0zNBbg09nkzJfpBlcr8XQRQMRdrgQcp4fKYij7tXPQqHUnvgfQSZb_ZfDPFCzHXtoTM89q7C9326V77o1Z8gCgQ-8ycJn0EemFOTL5dwFWh_BA7X82eUqnqbN0hp57vQf1etzkujieHuXLO-zZSoLUyngv8KCbtUVD3Cpu-fM1XDzoj3BHEZee2QH3ZKuYGd-aDfr2gb33Xt-_qORar80wcyvGpGFg4DaCT9K63LZNTufPTbkWZ',
                'body' => [
                    'Pemerintah Dumbayabulan hari ini secara resmi memulai proyek pengaspalan jalan sepanjang 2,5 kilometer yang menghubungkan dusun tengah dengan area perkebunan warga. Proyek ini merupakan bagian dari program percepatan ekonomi desa yang didanai melalui Dana Desa tahun anggaran 2026.',
                    'Kepala Dumbayabulan menyatakan bahwa perbaikan akses jalan ini sangat krusial mengingat selama ini warga seringkali mengalami kendala saat mengangkut hasil bumi, terutama pada musim penghujan. "Dengan jalan yang lebih baik, biaya logistik petani akan berkurang dan harga jual produk kita bisa lebih kompetitif," ujarnya saat ditemui di lokasi proyek.',
                    'Infrastruktur adalah urat nadi ekonomi. Kami berkomitmen untuk memastikan setiap jengkal wilayah Dumbayabulan terkoneksi dengan layak demi kesejahteraan bersama.',
                    'Selain pengaspalan, proyek ini juga mencakup pembangunan drainase di sisi jalan untuk mencegah erosi dan genangan air. Warga desa menyambut antusias pembangunan ini dengan berpartisipasi aktif dalam pengawasan pengerjaan di lapangan.',
                    'Diharapkan pengerjaan ini akan selesai dalam kurun waktu 60 hari kalender, sehingga pada pergantian tahun nanti, akses transportasi warga sudah sepenuhnya lancar dan nyaman digunakan.'
                ]
            ],
            [
                'category' => 'Wisata',
                'created_at' => Carbon::now()->subDays(5),
                'author' => 'Admin Desa',
                'views' => 840,
                'title' => 'Pengembangan Kawasan Ekowisata Mangrove Desa Dumbayabulan',
                'excerpt' => 'Langkah strategis pemerintah desa dalam mengoptimalkan potensi alam mangrove sebagai destinasi wisata berkelanjutan yang mendunia.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsLNS_O1KkwFS8poYnnimWqmf0EiYjAhhxKlOETxlabIG2rchVkJa95vP5RaxTbWFL0QTPoPF1R486SQaAZCDzjxgJq2i2xakaFZBB6n25pR-SnOLL_FUp5V5ozabqR5CqIhfb9Gonb_-_B1LNQQv7sVKqxoJtyAr2veFGP8AcWN5yHElfE0NDUdCeaQDcEo8xeagViOgpr0PyIPhU3S-Clmgdu4rlTGLgZrkeMYsIS-R-elkuYLmYQ4QsvIcnwrw1iGiaW6r4_99',
                'body' => [
                    'Pemerintah Desa Dumbayabulan meluncurkan inisiatif pengembangan kawasan ekowisata hutan mangrove secara komprehensif. Upaya ini ditujukan untuk melestarikan bentang alam pesisir sekaligus memberdayakan perekonomian warga lokal.',
                    'Kawasan ekowisata ini akan dilengkapi dengan jembatan kayu estetik (wooden boardwalk) sepanjang 500 meter yang membelah rimbunnya hutan mangrove, menara pandang satwa, pusat edukasi lingkungan, serta dermaga perahu tradisional untuk menyusuri pesisir.',
                    'Ekowisata mangrove ini mengintegrasikan perlindungan keanekaragaman hayati pesisir dengan pariwisata bertanggung jawab, yang nantinya akan dikelola penuh oleh Badan Usaha Milik Desa (BUMDes).',
                    'Warga desa juga diberikan pelatihan sebagai pramuwisata profesional, pengrajin suvenir ramah lingkungan, serta pelaku industri kuliner laut khas Gorontalo untuk menunjang kawasan wisata mandiri ini.'
                ]
            ],
            [
                'category' => 'Pemerintahan',
                'created_at' => Carbon::now()->subDays(10),
                'author' => 'Sekretaris Desa',
                'views' => 920,
                'title' => 'Rapat Pleno Penetapan Rencana Kerja Pemerintah Desa (RKPDes) 2024',
                'excerpt' => 'Transparansi anggaran desa menjadi prioritas utama dalam penyusunan program kerja tahun mendatang demi kesejahteraan warga.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaRsjc2Fy3AwhPt6QzHrny9GPJHwVUaTML5TY_xLyI44YwbJd1QOblnnzpCrmCD1SiZXETkgX2LR9rScOhAmQ-VNiSAFlTJ8xfEDpQXW7mRCr2qMyJXzRtWsv9MGtZHyuF-1BiJ1f3pgVHTY4LNxzwbwL8nhyxF2RTL_kOiEt1dmZOtKJI_UTbyRRLkoYzu7PFKZSRVeZBKL-e1RuYWlgz_xYQUgIpJPBkqZmi0-Zw2Tr9ih4euB8WdE1NvLPB3H8aqiNaGMedTkGJ',
                'body' => [
                    'Badan Permusyawaratan Desa (BPD) bersama jajaran Pemerintah Desa Dumbayabulan menyelenggarakan Rapat Pleno Terbuka untuk menyepakati prioritas program pembangunan yang tertuang dalam RKPDes 2024.',
                    'Proses penyusunan program kerja ini berlandaskan asas musyawarah mufakat, mendengarkan langsung aspirasi warga dari tiap-tiap dusun guna mengalokasikan Dana Desa secara efektif dan transparan.',
                    'Prioritas pembangunan tahun depan difokuskan pada peningkatan infrastruktur pertanian, penguatan ketahanan pangan dusun, program penuntasan stunting, dan penyediaan fasilitas air bersih terpadu.',
                    'Dokumen RKPDes yang telah ditandatangani dipajang secara terbuka di papan informasi desa dan portal digital agar masyarakat dapat memantau pelaksanaannya.'
                ]
            ],
            [
                'category' => 'Ekonomi',
                'created_at' => Carbon::now()->subDays(12),
                'author' => 'Kaur Ekonomi',
                'views' => 710,
                'title' => 'Peningkatan Hasil Panen Melalui Modernisasi Alat Pertanian Desa',
                'excerpt' => 'Kelompok tani Desa Dumbayabulan menerima bantuan traktor dan alat penggiling padi otomatis untuk meningkatkan efisiensi produksi.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDReXCZoYEZ_UfR-hmtwtrk2un_CFXAu9pIs4Pk757bvEMKlYXlrwpG1h9dSKyt77bB3ZOeM2PUQ_FudfYFQ2miVBNqi0TmR_I30o95qJnNptbwehkn4oGGitRASnpvO2YFQGUPXG8xfzGzEFiBqeNamYsfuLgMKXtFOOUUT4QfbHNCBVfgPrQnioQJKn_P3pXeLgLPdTsHB7vpUX_GTJiJtzzq57P-tY5fs6vb9g6u7QlKY6G-T8CRgrdfgtfI3ihxfXJ-u92JcXSZ',
                'body' => [
                    'Dalam rangka modernisasi sektor agraris, kelompok tani Desa Dumbayabulan menerima paket bantuan alat dan mesin pertanian (Alsintan) modern dari dinas terkait.',
                    'Paket bantuan mencakup hand-tractor berteknologi tinggi, pompa air irigasi, serta mesin penggiling padi otomatis portabel yang langsung diserahterimakan kepada perwakilan gapoktan.',
                    'Langkah modernisasi ini diharapkan mampu menekan biaya produksi pasca-panen serta mempercepat masa tanam serempak, yang pada akhirnya mendongkrak kesejahteraan keluarga petani.',
                    'Pelatihan operasional dan perawatan mesin langsung diberikan oleh penyuluh pertanian lapangan untuk memastikan alsintan dapat digunakan secara berkelanjutan.'
                ]
            ],
            [
                'category' => 'Pembangunan',
                'created_at' => Carbon::now()->subDays(15),
                'author' => 'Admin Desa',
                'views' => 650,
                'title' => 'Progres Pembangunan Jembatan Penghubung Dusun II Capai 80%',
                'excerpt' => 'Aksesibilitas antar wilayah di Desa Dumbayabulan terus ditingkatkan untuk memperlancar mobilitas warga dan distribusi hasil bumi.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdhaANP1hcf-6-3Sjj3p73b9arHXKuXRQng17F-fJFJ4tx2OW7S62q4pPZSuJCp_VBKjUL8LChGz-CNZvoM07ThncF-v_R9_RPaoMNDmn8zVD8jJH3eaFIPQTFM11QUNlGN21F01l9-TD3aG_zyiXlePJJqMo1pUlemrPv-uO3QM6aeDpXYrQxjP9TVMNxPIxII9ijSHJPNAovP1KtCkXLjcSUVnjbx_NWP8GML_0vyPTD_y7fcrluYeZL5qCpcsPH4y5WaRyheCH7',
                'body' => [
                    'Pengerjaan fisik jembatan beton yang menghubungkan wilayah pemukiman Dusun II dengan kawasan perkebunan rakyat kini telah memasuki tahap penyelesaian akhir.',
                    'Pembangunan infrastruktur vital ini ditargetkan rampung sepenuhnya pada pertengahan bulan depan, memperlancar jalur transportasi yang selama ini terisolasi saat air sungai meluap.',
                    'Konstruksi jembatan dirancang kokoh dengan fondasi tiang pancang beton bertulang agar mampu menahan beban kendaraan angkut hasil bumi dan awet hingga puluhan tahun.',
                    'Aksesibilitas yang lancar adalah kunci untuk memotong waktu perjalanan warga serta mempercepat perputaran ekonomi di sektor perkebunan desa.'
                ]
            ],
            [
                'category' => 'Pengumuman',
                'created_at' => Carbon::now()->subDays(20),
                'author' => 'Panitia Kegiatan',
                'views' => 1080,
                'title' => 'Festival Budaya Pesisir Desa Dumbayabulan Akan Segera Digelar',
                'excerpt' => 'Persiapan matang terus dilakukan untuk menyambut ribuan wisatawan dalam ajang tahunan pesta rakyat pesisir Desa Dumbayabulan.',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfAvRda6-PnUMtosBy_0pdqT_1iLBv-0f60sITVSO6D1vO06Kx7ljrHZDYAM5msJbnd45HjIifuGRUnFXj8yLnLN5NA-DGgQduMM1p_3T7gwZYnG3ZvrXJxaKXy29dXslLPtEuBmRGSbZ0eMfb05JekwJmjUA1qY3lUA1qY3lOeDm66v66bKEDTdSyxvAHK3_Bcclkpk_xuZcpJHARSmlEtXRLiQKOFu655JNJy_8Bl0Os_MajYdUyOz7lR_I5tYfH3E1rkNNEa1jdBrdPALY',
                'body' => [
                    'Masyarakat pesisir Desa Dumbayabulan bersiap memeriahkan perhelatan akbar tahunan Festival Budaya Pesisir yang akan berlangsung selama tiga hari penuh.',
                    'Rangkaian acara akan menyajikan pertunjukan seni tari kolosal tradisional, lomba perahu dayung hias, ritual adat syukuran laut, bazaar kuliner pesisir, serta pameran produk UMKM kreatif warga.',
                    'Perhelatan budaya ini bertujuan melestarikan warisan leluhur sekaligus menjadi magnet promosi pariwisata daerah Gorontalo di kancah nasional.',
                    'Panitia pelaksana mengundang seluruh wisatawan untuk hadir menikmati keindahan budaya dan keramahan khas pesisir Dumbayabulan.'
                ]
            ]
        ];

        foreach ($news as $item) {
            $words = explode(' ', $item['author']);
            $initials = '';
            foreach ($words as $w) {
                if(strlen($w) > 0) $initials .= strtoupper($w[0]);
            }
            if (strlen($initials) > 2) $initials = substr($initials, 0, 2);
            $item['initials'] = $initials;
            
            // Convert body array to HTML string
            $htmlBody = '';
            foreach ($item['body'] as $para) {
                $htmlBody .= '<p class="mb-4 text-justify leading-relaxed text-on-surface-variant">' . e($para) . '</p>';
            }
            $item['body'] = $htmlBody;
            
            Berita::create($item);
        }
    }
}
