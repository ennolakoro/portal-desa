import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet';

export default function MapAndStats({ setCurrentPage }) {
  const [profilData, setProfilData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [apbdesData, setApbdesData] = useState(null);
  const [demografiData, setDemografiData] = useState(null);

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

    fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/apbdes?tahun=2024')
      .then(res => res.json())
      .then(json => {
        if (json && !json.message) {
          setApbdesData(json);
        }
      })
      .catch(err => console.error(err));

    fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/demografi')
      .then(res => res.json())
      .then(json => {
        if (json && json.summary) {
          setDemografiData(json.summary);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const center = profilData?.map_lat && profilData?.map_lng
    ? [parseFloat(profilData.map_lat), parseFloat(profilData.map_lng)]
    : [0.5432, 123.1234]; // Fallback coordinate if not set

  const zoom = profilData?.map_zoom ? parseInt(profilData.map_zoom) : 13;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Map */}
      <div className="lg:col-span-8 group">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-primary font-semibold text-3xl mb-2 tracking-tight">Peta Wilayah</h2>
            <p className="text-on-surface-variant text-base">
              Distribusi Point of Interest Desa Dumbaya Bulan
            </p>
          </div>
          <button
            onClick={() => setCurrentPage && setCurrentPage('profil')}
            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all cursor-pointer"
          >
            Detail Peta <span className="material-symbols-outlined">map</span>
          </button>
        </div>
        <div className="relative h-[480px] bg-white rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 z-0">
          {!profilData ? (
            <div className="w-full h-full flex items-center justify-center bg-surface-container animate-pulse text-on-surface-variant">Memuat Peta Wilayah...</div>
          ) : (
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={center}></Marker>

              {geoJsonData && (
                <GeoJSON
                  key="village-border"
                  data={geoJsonData}
                  style={{ color: '#2563eb', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.2 }}
                />
              )}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        {/* Demographics */}
        <div className="bg-primary rounded-xl p-8 text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <h3 className="text-xl font-bold mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-fixed">groups</span> Demografi Desa
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-5 rounded border border-white/10">
              <span className="block text-3xl font-extrabold text-primary-fixed mb-1">
                {demografiData ? Number(demografiData.total).toLocaleString('id-ID') : '1.176'}
              </span>
              <span className="text-xs opacity-60 uppercase tracking-widest font-bold">Jiwa</span>
            </div>
            <div className="bg-white/5 p-5 rounded border border-white/10">
              <span className="block text-3xl font-extrabold text-primary-fixed mb-1">
                {demografiData ? Number(demografiData.kk).toLocaleString('id-ID') : '349'}
              </span>
              <span className="text-xs opacity-60 uppercase tracking-widest font-bold">KK</span>
            </div>
            <div className="bg-white/5 p-5 rounded border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white">
                  {demografiData ? Number(demografiData.laki).toLocaleString('id-ID') : '592'}
                </span>
                <span className="material-symbols-outlined text-blue-400 text-sm">male</span>
              </div>
              <span className="text-xs opacity-60 uppercase tracking-widest font-bold">Laki-Laki</span>
            </div>
            <div className="bg-white/5 p-5 rounded border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white">
                  {demografiData ? Number(demografiData.perempuan).toLocaleString('id-ID') : '584'}
                </span>
                <span className="material-symbols-outlined text-pink-400 text-sm">female</span>
              </div>
              <span className="text-xs opacity-60 uppercase tracking-widest font-bold">Perempuan</span>
            </div>
          </div>
        </div>

        {/* APBDes Transparency */}
        <div className="bg-white rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <h3 className="text-primary font-bold text-xl mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>{' '}
            Transparansi APBDes
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-surface-container-low rounded-lg border border-outline-variant/20 flex justify-between items-center">
              <span className="font-medium text-on-surface-variant">Pendapatan</span>
              <span className="font-bold text-primary text-lg">
                Rp{apbdesData?.pendapatan_realisasi ? Number(apbdesData.pendapatan_realisasi).toLocaleString('id-ID') : '0'}
              </span>
            </div>
            <div className="p-5 bg-surface-container-low rounded-lg border border-outline-variant/20 flex justify-between items-center">
              <span className="font-medium text-on-surface-variant">Belanja</span>
              <span className="font-bold text-error text-lg">
                Rp{apbdesData?.belanja_realisasi ? Number(apbdesData.belanja_realisasi).toLocaleString('id-ID') : '0'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage && setCurrentPage('infografis', 'apbdes')}
            className="mt-8 w-full py-4 bg-primary/5 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            Laporan Keuangan <span className="material-symbols-outlined">analytics</span>
          </button>
        </div>
      </div>
    </section>
  );
}
