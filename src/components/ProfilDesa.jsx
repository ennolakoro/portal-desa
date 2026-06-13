import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet';

export default function ProfilDesa() {
  const [activeTab, setActiveTab] = useState('visi-misi');
  const [profileData, setProfileData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState('');

  const openLightbox = (url, title) => {
    setLightboxImage(url);
    setLightboxTitle(title);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/profil-desa');
      const json = await res.json();
      if (res.ok) {
        setProfileData(json);
        if (json.map_geojson) {
          try {
            setGeoJsonData(JSON.parse(json.map_geojson));
          } catch (e) {
            console.error('Invalid GeoJSON');
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const center = profileData?.map_lat && profileData?.map_lng 
    ? [parseFloat(profileData.map_lat), parseFloat(profileData.map_lng)]
    : [0.5432, 123.1234];
    
  const zoom = profileData?.map_zoom ? parseInt(profileData.map_zoom) : 13;

  return (
    <div>
      <div className="animate-fade-in">
      {/* Visi & Misi Section */}
      <section className="bg-gradient-to-br from-primary via-primary-container to-secondary py-16 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="dots" patternUnits="userSpaceOnUse" width="40">
                <circle cx="2" cy="2" fill="white" r="2"></circle>
              </pattern>
            </defs>
            <rect fill="url(#dots)" height="100%" width="100%"></rect>
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-10 relative z-10 space-y-8">
          {/* Visi Card */}
          <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl border border-white/20 text-center transform hover:scale-[1.01] transition-transform duration-300">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs uppercase tracking-widest mb-6">
              Visi
            </span>
            <p className="text-2xl md:text-4xl text-primary leading-tight max-w-4xl mx-auto italic font-extrabold text-slate-800 dark:text-white">
              {profileData?.visi || '"Terwujudnya Desa Dumbaya Bulan yang Mandiri, Sejahtera, dan Berkeadilan melalui Tata Kelola Pemerintahan yang Transparan dan Partisipatif."'}
            </p>
          </div>

          {/* Misi Card */}
          <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl border border-white/20 text-slate-800 dark:text-white">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs uppercase tracking-widest mb-4">
                Misi
              </span>
              <h2 className="text-3xl font-bold text-primary dark:text-white">Arah Kebijakan Desa</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {(Array.isArray(profileData?.misi) ? profileData.misi : [
                'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi untuk kemudahan akses warga.',
                'Mendorong pemberdayaan ekonomi masyarakat melalui optimalisasi potensi desa dan UMKM lokal.',
                'Mewujudkan pembangunan infrastruktur yang merata dan berkelanjutan dengan menjaga kelestarian alam.',
                'Memperkuat nilai-nilai religius dan budaya lokal dalam kehidupan bermasyarakat sehari-hari.'
              ]).map((misiText, index) => (
                <div key={index} className="flex items-start gap-6 p-6 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white dark:hover:bg-white/25 transition-all duration-300 border border-transparent hover:border-secondary-fixed/50 group">
                  <span className="bg-primary text-on-primary h-10 w-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
                    {index + 1}
                  </span>
                  <p className="text-lg font-medium leading-relaxed text-on-surface-variant">
                    {misiText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bagan Desa Section */}
      <section className="py-16 bg-surface-bright">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-l-4 border-primary pl-6">
            <div>
              <h2 className="text-3xl font-bold text-primary">Struktur Organisasi</h2>
              <p className="text-on-surface-variant text-base">
                Sistem Tata Kerja Pemerintahan dan Lembaga Desa Dumbaya Bulan
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-surface-container transition-colors border border-outline-variant cursor-pointer">
                <span className="material-symbols-outlined text-primary">share</span>
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container transition-colors border border-outline-variant cursor-pointer">
                <span className="material-symbols-outlined text-primary">download</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Government Chart */}
            <div className="group">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-outline-variant hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4 p-2">
                  <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary">Pemerintahan Desa</h3>
                </div>
                <div className="bg-surface-container-high rounded-xl overflow-hidden aspect-video relative p-2">
                  <img
                    className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-700"
                    alt="Bagan Pemerintahan Desa"
                    src={profileData?.bagan_pemerintahan_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDE3ntKNXdkuBfnbsS1rK0aMC7ZbsZF3uHxElEODDIn7MCtt7KDST5PhAOZevKj8AhBnpkLvv44yzPlvvVmnB-sTZQOIVHnCl9uFJhZRBW7Bcbii2VYZkKJrQBnr0W-5jBMKGy9dK5xT6dxDX2Vg0EyFiB-BLIsm7HvWnCSKk_C1iCff9GB6fLAbFlqPrEW71k7PuhiAe44hIv9b_sLwNcQOwQcmKCZy1hpCBDdfgCW8Jkz4KBDbyjuihNC-vY8kDpsRnXW5gNksZL7"}
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => openLightbox(
                        profileData?.bagan_pemerintahan_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDE3ntKNXdkuBfnbsS1rK0aMC7ZbsZF3uHxElEODDIn7MCtt7KDST5PhAOZevKj8AhBnpkLvv44yzPlvvVmnB-sTZQOIVHnCl9uFJhZRBW7Bcbii2VYZkKJrQBnr0W-5jBMKGy9dK5xT6dxDX2Vg0EyFiB-BLIsm7HvWnCSKk_C1iCff9GB6fLAbFlqPrEW71k7PuhiAe44hIv9b_sLwNcQOwQcmKCZy1hpCBDdfgCW8Jkz4KBDbyjuihNC-vY8kDpsRnXW5gNksZL7",
                        "Bagan Pemerintahan Desa"
                      )}
                      className="bg-white text-primary px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
                    >
                      <span className="material-symbols-outlined">zoom_in</span>
                      Lihat Detail Struktur
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* BPD Chart */}
            <div className="group">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-outline-variant hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4 p-2">
                  <div className="h-12 w-12 rounded-xl bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">diversity_3</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary">Badan Permusyawaratan</h3>
                </div>
                <div className="bg-surface-container-high rounded-xl overflow-hidden aspect-video relative p-2">
                  <img
                    className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-700"
                    alt="Bagan BPD"
                    src={profileData?.bagan_bpd_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBMnl0y20DcxujJ-0KHCtgQh6-TJv8NurBT5fD6W4AiNpdsiPyoY20DWiEqYqbII39pMlZIksol322XZZ7_XeOQhTw0eT6tdnTqrtDiRnb9VrzsF1Ao-cMwHTS3IlDoGE4iBfF8zHkz4POzrho6-hBPT_crjUs6nWa3xZwA3Z5W8-sFPhI0Ar2btOuwblJAw8u9UaujAvoVGckCziSRD9eB3kdaIn2EPuHP0PL73arBVHQAGc2JE4gBHo6eO6CsmP8ZXHUP9kjt6wQs"}
                  />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => openLightbox(
                        profileData?.bagan_bpd_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBMnl0y20DcxujJ-0KHCtgQh6-TJv8NurBT5fD6W4AiNpdsiPyoY20DWiEqYqbII39pMlZIksol322XZZ7_XeOQhTw0eT6tdnTqrtDiRnb9VrzsF1Ao-cMwHTS3IlDoGE4iBfF8zHkz4POzrho6-hBPT_crjUs6nWa3xZwA3Z5W8-sFPhI0Ar2btOuwblJAw8u9UaujAvoVGckCziSRD9eB3kdaIn2EPuHP0PL73arBVHQAGc2JE4gBHo6eO6CsmP8ZXHUP9kjt6wQs",
                        "Bagan Badan Permusyawaratan (BPD)"
                      )}
                      className="bg-white text-primary px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
                    >
                      <span className="material-symbols-outlined">zoom_in</span>
                      Lihat Detail BPD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Desa Section */}
      <section className="bg-surface py-16 border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed/30 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">history_edu</span>
                <span>Jejak Sejarah Desa Dumbaya Bulan</span>
              </div>
              <h2 className="text-3xl md:text-5xl text-primary font-extrabold leading-tight">
                Mengenal Lebih Dekat Asal Usul Desa Kami
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {profileData?.sejarah || 'Sejarah adalah fondasi masa depan. Kami sedang mengumpulkan kepingan cerita dari para tetua dan arsip untuk mendokumentasikan perjalanan Desa Dumbaya Bulan secara akurat dan komprehensif.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-lg hover:-translate-y-1 cursor-pointer">
                  Ajukan Sejarah Desa
                </button>
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-all cursor-pointer">
                  Hubungi Admin
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-surface-container-highest rounded-xl p-8 flex flex-col items-center text-center space-y-4 shadow-inner relative overflow-hidden border border-outline-variant/20">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-fixed/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-fixed/20 rounded-full blur-3xl"></div>
                <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-4 z-10">
                  <span className="material-symbols-outlined text-primary text-4xl animate-pulse">
                    hourglass_empty
                  </span>
                </div>
                <p className="text-xl font-bold text-primary z-10">Sedang Dalam Penyusunan</p>
                <p className="text-on-surface-variant text-sm z-10 max-w-sm">
                  Kami bekerja keras untuk menghadirkan narasi sejarah yang berkualitas bagi seluruh warga dan pengunjung.
                </p>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden z-10 shadow-inner">
                  <div className="h-full bg-primary w-[35%] rounded-full transition-all duration-500"></div>
                </div>
                <p className="text-xs font-bold text-primary/60 z-10">Proses Pengumpulan Data: 35%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Lokasi Desa Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined text-3xl">map</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary leading-none">Geografi Desa</h2>
                <p className="text-on-surface-variant text-sm mt-1">Letak astronomis dan batas wilayah administratif</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Statistics & Info Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex-1">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">explore</span>
                  Batas Wilayah
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Utara', value: profileData?.batas_utara || 'Desa Tolotio', tag: 'U' },
                    { label: 'Timur', value: profileData?.batas_timur || 'Desa Poowo', tag: 'T' },
                    { label: 'Selatan', value: profileData?.batas_selatan || 'Teluk Tomini', tag: 'S' },
                    { label: 'Barat', value: profileData?.batas_barat || 'Desa Kabila Bone', tag: 'B' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-transparent hover:border-primary/10 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-extrabold text-primary border border-outline-variant/30">
                        {item.tag}
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="font-bold text-on-surface text-base">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[150px]">hub</span>
                </div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-1">
                    <p className="text-on-primary/60 text-xs uppercase tracking-wider font-semibold">Luas Wilayah</p>
                    <p className="text-2xl font-extrabold">{profileData?.luas_wilayah || '42.5'} Ha</p>
                  </div>
                  <div className="space-y-1 border-l border-on-primary/20 pl-4">
                    <p className="text-on-primary/60 text-xs uppercase tracking-wider font-semibold">Populasi</p>
                    <p className="text-2xl font-extrabold">{profileData?.populasi_sementara || '1.429'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant h-full min-h-[500px] relative group z-0">
                {!profileData ? (
                  <div className="w-full h-full flex items-center justify-center animate-pulse text-on-surface-variant">Memuat Peta Geografi...</div>
                ) : (
                  <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={center}></Marker>
                    
                    {geoJsonData && (
                      <GeoJSON 
                        key="village-border-profil" 
                        data={geoJsonData} 
                        style={{ color: '#2563eb', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.2 }}
                      />
                    )}
                  </MapContainer>
                )}
                
                <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
                  <div className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-lg text-on-primary text-xs flex items-center gap-2 border border-white/10 shadow-2xl">
                    <span className="material-symbols-outlined text-sm">map</span>
                    <span>Peta Geografi & Batas Desa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="absolute top-4 right-4 flex gap-4">
            <button 
              className="text-white hover:text-primary transition-colors bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer flex items-center justify-center border-none"
              onClick={(e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = lightboxImage;
                a.download = lightboxTitle.replace(/\s+/g, '_') + '.jpg';
                a.target = '_blank';
                a.click();
              }}
              title="Unduh Gambar"
            >
              <span className="material-symbols-outlined text-2xl">download</span>
            </button>
            <button 
              className="text-white hover:text-primary transition-colors bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer flex items-center justify-center border-none"
              onClick={() => setLightboxImage(null)}
              title="Tutup"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          
          <div 
            className="w-[90vw] h-[80vh] rounded-2xl overflow-auto shadow-2xl relative border border-white/10 flex items-center justify-center bg-black/50 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt={lightboxTitle} 
              className="max-w-full max-h-full object-contain animate-scale-up m-auto" 
            />
          </div>
          
          <h4 className="text-white font-bold mt-4 text-lg text-center tracking-wide uppercase">
            {lightboxTitle}
          </h4>
        </div>
      )}
    </div>
  );
}
