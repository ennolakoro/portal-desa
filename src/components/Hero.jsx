import { useState, useEffect } from 'react';

export default function Hero() {
  const [settings, setSettings] = useState({
    hero_title: 'Portal Resmi Transformasi Digital Desa Dumbaya Bulan',
    hero_tagline: 'Pusat informasi pemerintahan terpadu, layanan publik modern, dan eksplorasi potensi lokal untuk kesejahteraan warga Desa Dumbaya Bulan, Kabupaten Bone Bolango.'
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/desa-setting')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return (
    <section className="relative h-[550px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          alt="Panoramic landscape of Dumbaya Bulan Village"
          className="w-full h-full object-cover scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvJsKmV289A-gj3oBHyvukiDt0RVDC_YyQ0rzaZE6YhLiB-CKstYZMUUcFaeL8mBJedRZeltMcvrI99iqPSRDDr2WPp79g6ilerAdT5ZLtGLHaE2Ht2trpFj5zNgqNb4QK7xaGiZo_7bBjeB3i5KdFRYbkfrkwkc91sHLrATiyGV4rtALe1ZZVD8Ln-BivjspzpuAJvPHq95GZplGdaGM6iGczhcUrIu51OIR172CHmzgr92VtcdmxpY33VQJ2oSsomNWNPLwbMcug"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 w-full">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-fixed/20 text-primary-fixed font-bold text-xs tracking-widest uppercase mb-6 backdrop-blur-sm animate-fade-in">
            Selamat Datang
          </span>
          <h1 className="text-white font-bold text-4xl md:text-5xl mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
            {settings.hero_title}
          </h1>
          <p className="text-on-primary/80 text-lg md:text-xl max-w-2xl mb-2 leading-relaxed animate-fade-in-up delay-200">
            {settings.hero_tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
