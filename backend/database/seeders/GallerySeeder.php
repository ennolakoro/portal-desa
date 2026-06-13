<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            [
                'src' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuClKJSs4wUmzSg4mv53BVViTM704Uz8blmcUvLu-tCWenbF5x00O0vyQhiLwMetzcsMUMHQFgJ1Jtlz-0TTdmTIdlRC642lv0leXDIBwCBI3ZtcUXNIBODQFKXAdUvg-jVH4-v9K4O2_Tv_NWm8RQkkaSWnK4vXWH-a08_8BpEMtqyD8Dd-8y_y6LhrH1dpz9h_8CWMkLESqd3bBblMwu6Lude8DS0_pjt93uca0hlGoezqjNyWpREEyiApkivmuRWX63Eh_i5hDblq',
                'alt' => 'Galeri 1'
            ],
            [
                'src' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAELWBYK8omAP5ayEFsXjnq2kZDx2IIGc_82GfCCbR2mw_mvohCwxQb5OfT1WuR9x2BMSxOZO-EdWmM2R6NAwpmTZsobPMCnmiR0Z-TWs_DGznutPqZV-lW3O6Uq-rkXflFiYI6XuICe6siFT1U-qDE7ZmbnML9whCOBZ-oGLfNLlddiHPwPJZU6tbmMRIZGWBr_o0YhuCJMm76GYPaZ-fXy-477BYqGhSxqHfVcGmjCBLUMXrhZ8FazOVpXNIiAQgVP4KCYU3O33m',
                'alt' => 'Galeri 2'
            ],
            [
                'src' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuABngOO7uIxvGvWlfIxTZVp81aLl8f05gh0rYLAqIWK7c3OuehFN80hp0RlBse8CbJ9UZrOLn-ERD6TALgEpMElsM6nipoG8IHcLCJb358K7DZPoKUQZW75oM4hGl4Wc_J2qq8dMrKD5KRg6HAvLJuzVI9Z0ZifkV1iFv3c_2jcS4fs-w6rOanqjHhLVfpN5EpA_IhqG8mdCpnOme6ABqhwixBg7dwxMv7F2WXuniU3FvnoR3dYDXyhcrnvRScOxg5yQU3GojlMAsp0',
                'alt' => 'Galeri 3'
            ],
            [
                'src' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA27E_6325WPe6A6mU0iGa3YeOvdDeElmNmOcUwJ07wN95hjel7htcKyJ1zZXGJ58XO2h57omJ5KeuVPDztbr6bskBqT1NJf0rB3KI3T7-j9KH2w9-HEMKvX0pa5lTS16AvSADNZ97BHnjFd0a4uYRYXE3gFZDnQLg2UBoOoCHgOu3Q-PGQ-Dt19JAQBHVM0PiQVwd9DLfw6NatLC6zeZyMWaPGGaMxf_liAXQb_MP1hkckT3Rnac3yGgRqwF9dNwk-XYOEZ2Z05moy',
                'alt' => 'Galeri 4'
            ],
        ];

        foreach ($images as $img) {
            Gallery::create($img);
        }
    }
}
