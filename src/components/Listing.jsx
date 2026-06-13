import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (category) => {
  const colors = {
    kantor: 'bg-blue-600',
    kesehatan: 'bg-red-500',
    pendidikan: 'bg-emerald-600',
    wisata: 'bg-amber-500',
  };
  const icons = {
    kantor: 'corporate_fare',
    kesehatan: 'local_hospital',
    pendidikan: 'school',
    wisata: 'forest',
  };

  const color = colors[category] || 'bg-primary';
  const icon = icons[category] || 'location_on';

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full ${color} text-white shadow-lg border-2 border-white">
        <span class="material-symbols-outlined text-[16px] font-bold">${icon}</span>
      </div>
    `,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const poiData = [
  {
    id: 1,
    name: 'Kantor Kepala Desa Dumbaya Bulan',
    category: 'kantor',
    lat: 0.51488,
    lng: 123.2243,
    description: 'Pusat administrasi, koordinasi pembangunan, dan pelayanan publik masyarakat Desa Dumbaya Bulan.',
    address: 'Jln. Utama Dumbaya Bulan, Dusun Kampung Baru',
    phone: '0812-3456-7890'
  },
  {
    id: 2,
    name: 'Puskesmas Pembantu (Pustu) Dumbaya Bulan',
    category: 'kesehatan',
    lat: 0.5165,
    lng: 123.2215,
    description: 'Fasilitas pelayanan kesehatan dasar bagi warga Desa Dumbaya Bulan, melayani pemeriksaan umum dan posyandu.',
    address: 'Dusun Pantai, Desa Dumbaya Bulan',
    phone: '0853-9988-7766'
  },
  {
    id: 3,
    name: 'Posyandu Mawar',
    category: 'kesehatan',
    lat: 0.5122,
    lng: 123.2280,
    description: 'Pusat pelayanan kesehatan terpadu bagi ibu hamil, bayi, balita, dan lansia di wilayah Dusun Pemukiman.',
    address: 'Dusun Pemukiman, Desa Dumbaya Bulan',
    phone: '-'
  },
  {
    id: 4,
    name: 'SDN 1 Suwawa Timur (Dumbaya Bulan)',
    category: 'pendidikan',
    lat: 0.5178,
    lng: 123.2255,
    description: 'Sekolah Dasar Negeri utama di Desa Dumbaya Bulan dengan akreditasi A, mendidik anak-anak tingkat dasar.',
    address: 'Jln. Pendidikan No. 4, Dusun Kampung Baru',
    phone: '-'
  },
  {
    id: 5,
    name: 'PAUD Harapan Bangsa',
    category: 'pendidikan',
    lat: 0.5135,
    lng: 123.2208,
    description: 'Pendidikan anak usia dini berbasis masyarakat untuk mempersiapkan tumbuh kembang generasi muda desa.',
    address: 'Dusun Pantai, Desa Dumbaya Bulan',
    phone: '-'
  },
  {
    id: 6,
    name: 'Wisata Bantaran Sungai Dumbaya Bulan',
    category: 'wisata',
    lat: 0.5190,
    lng: 123.2290,
    description: 'Wisata alam berkonsep ramah lingkungan di sepanjang aliran sungai dengan pemandangan lembah dan gazebo santai.',
    address: 'Dusun Pemukiman Atas, Desa Dumbaya Bulan',
    phone: '0821-2233-4455'
  },
  {
    id: 7,
    name: 'Bukit Bintang Dumbaya Bulan',
    category: 'wisata',
    lat: 0.5080,
    lng: 123.2190,
    description: 'Wisata puncak perbukitan dengan latar lanskap pemukiman desa dan pegunungan, populer di sore dan malam hari.',
    address: 'Dusun Pantai Atas, Desa Dumbaya Bulan',
    phone: '-'
  }
];

export default function Listing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [profilData, setProfilData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [mapType, setMapType] = useState('satellite');

  useEffect(() => {
    fetch('https://api.desadumbayabulan.my.id/api/v1/profil-desa')
      .then(res => res.json())
      .then(json => {
        if (json) {
          setProfilData(json);
          if (json.map_geojson) {
            try {
              setGeoJsonData(JSON.parse(json.map_geojson));
            } catch (e) {
              console.error('Invalid GeoJSON format');
            }
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const center = profilData?.map_lat && profilData?.map_lng 
    ? [parseFloat(profilData.map_lat), parseFloat(profilData.map_lng)]
    : [0.5432, 123.1234];
    
  const zoom = profilData?.map_zoom ? parseInt(profilData.map_zoom) : 13;

  const filteredPOIs = poiData.filter(poi => {
    const matchesCategory = filterCategory === 'all' || poi.category === filterCategory;
    const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poi.description && poi.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="animate-fade-in flex-grow">
      {/* Hero Title Section */}
      <section className="px-4 md:px-10 max-w-[1280px] mx-auto py-10 md:py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-tight">
            PETA DESA
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Menampilkan Peta Desa Dengan{' '}
            <span className="italic font-semibold">Interest Point</span>{' '}
            Desa Dumbaya Bulan
          </p>
        </div>
      </section>

      {/* Map Container */}
      <section className="px-4 md:px-10 max-w-[1280px] mx-auto pb-16 md:pb-24">
        <div className="relative bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant shadow-sm h-[500px] md:h-[600px] group z-0">
          {!profilData ? (
            <div className="w-full h-full flex items-center justify-center animate-pulse text-on-surface-variant font-bold">
              Memuat Peta Desa...
            </div>
          ) : (
            <MapContainer 
              center={center} 
              zoom={zoom} 
              scrollWheelZoom={true} 
              zoomControl={true}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution={
                  mapType === 'satellite'
                    ? '&copy; Google Maps'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
                url={
                  mapType === 'satellite'
                    ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
              />
              <Marker position={center}></Marker>
              
              {geoJsonData && (
                <GeoJSON 
                  key={`${mapType}-${JSON.stringify(geoJsonData).length}`} 
                  data={geoJsonData} 
                  style={{ 
                    color: mapType === 'satellite' ? '#10b981' : '#2563eb', 
                    weight: 3, 
                    fillColor: mapType === 'satellite' ? '#10b981' : '#3b82f6', 
                    fillOpacity: 0.15 
                  }}
                />
              )}

              {filteredPOIs.map(poi => (
                <Marker 
                  key={poi.id} 
                  position={[poi.lat, poi.lng]} 
                  icon={createCustomIcon(poi.category)}
                >
                  <Popup className="custom-popup">
                    <div className="p-3 max-w-[240px] text-on-surface">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-primary text-base">
                          {poi.category === 'kantor' ? 'corporate_fare' :
                           poi.category === 'kesehatan' ? 'local_hospital' :
                           poi.category === 'pendidikan' ? 'school' : 'forest'}
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                          {poi.category === 'kantor' ? 'Kantor' :
                           poi.category === 'kesehatan' ? 'Kesehatan' :
                           poi.category === 'pendidikan' ? 'Pendidikan' : 'Wisata'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm mb-1 text-primary">{poi.name}</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-2">{poi.description}</p>
                      <div className="text-[10px] text-outline font-medium flex items-center gap-1 border-t border-outline-variant/10 pt-1.5">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>{poi.address}</span>
                      </div>
                      {poi.phone && poi.phone !== '-' && (
                        <div className="text-[10px] text-outline font-medium flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs">call</span>
                          <span>{poi.phone}</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none z-10"></div>

          {/* Floating Search Controls */}
          <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex flex-col md:flex-row gap-3 z-[400]">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-md border-none rounded-lg shadow-lg focus:ring-2 focus:ring-primary text-sm placeholder:text-on-surface-variant"
                placeholder="Telusuri Peta"
              />
            </div>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white/90 backdrop-blur-md border-none rounded-lg shadow-lg focus:ring-2 focus:ring-primary text-sm text-on-surface-variant cursor-pointer min-w-[200px]"
              >
                <option value="all">Lihat Semua</option>
                <option value="kantor">Kantor Desa</option>
                <option value="kesehatan">Fasilitas Kesehatan</option>
                <option value="pendidikan">Pendidikan</option>
                <option value="wisata">Tempat Wisata</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl">
                unfold_more
              </span>
            </div>
          </div>

          {/* Map Bottom Controls */}
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 flex items-end gap-4 z-[400]">
            {/* Layer Switcher */}
            <div 
              onClick={() => setMapType(prev => prev === 'satellite' ? 'streets' : 'satellite')}
              className="relative cursor-pointer group/layer"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 border-white shadow-lg overflow-hidden bg-surface-container relative">
                <img
                  alt="Layer Switcher"
                  className="w-full h-full object-cover"
                  src={
                    mapType === 'satellite'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthLiM1zQodXEGnRleNovdkCiw9LKS6ZxGqJAGYWFIKQsV_w3jNw9ahD5sIpWQI3Ispe08SwpzcDs-Dv6bmU37vtau0ermSC6H9SQ-5dTW6js0txCwX7Xv8YUEMBl1NAc0HNr_D8JXUNSo5g6zIKAAOaNem_0Ku6OlhWIPx5h6fEooPtJvBb-5m1hcWucN0_p3anjdCpDqM-6smE5dhUPFlCoI0minddW28v13iQxbURw2jmouZi2HS3kJL-4Q1-gdsNYwJtY8CpSU'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo5oqdRb7QegXa2wV4k6ESXmkuN17TXNW4-ik-iARDBNpwwArfWT3lJDG1FAK0ssRqMMfkFTokaCnhW7o-3pozp7O6wSU7RIB7dmENiWQZemJtQvs731PkdEc3FkZ9t5a1KpOMH2dWN6Q8PjayIR4mz515SAnwLM2sX8_k-zvlfK0M8r8giSRhWp0aCo2jBuJ8k1rkJ_iLad70MRHO1r5CDiQp3Qar_ohBV_wH1KIIMFREZRnA8d2qscdv3iiwXUbe3yU0yVBu1k-i'
                  }
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-[10px] md:text-xs font-bold uppercase">
                    {mapType === 'satellite' ? 'Streets' : 'Satellite'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Village Logo Overlay (Bottom Right) */}
          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 pointer-events-none opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500">
            <img
              alt="Logo Bone Bolango"
              className="h-16 md:h-24 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDthLiM1zQodXEGnRleNovdkCiw9LKS6ZxGqJAGYWFIKQsV_w3jNw9ahD5sIpWQI3Ispe08SwpzcDs-Dv6bmU37vtau0ermSC6H9SQ-5dTW6js0txCwX7Xv8YUEMBl1NAc0HNr_D8JXUNSo5g6zIKAAOaNem_0Ku6OlhWIPx5h6fEooPtJvBb-5m1hcWucN0_p3anjdCpDqM-6smE5dhUPFlCoI0minddW28v13iQxbURw2jmouZi2HS3kJL-4Q1-gdsNYwJtY8CpSU"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
