import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';

// Komponen helper untuk mengupdate center dan zoom peta secara dinamis
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function KelolaPetaForm({ token }) {
  const [formData, setFormData] = useState({
    map_lat: 0.5432,
    map_lng: 123.1234,
    map_zoom: 13,
    map_geojson: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/profil-desa', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          map_lat: data.map_lat || 0.5432,
          map_lng: data.map_lng || 123.1234,
          map_zoom: data.map_zoom || 13,
          map_geojson: data.map_geojson || ''
        });
        parseGeoJson(data.map_geojson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseGeoJson = (text) => {
    if (!text) {
      setGeoJsonData(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setGeoJsonData(parsed);
    } catch (e) {
      setGeoJsonData(null); // Invalid GeoJSON, abaikan preview
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'map_geojson') {
      parseGeoJson(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/profil-desa', {
        method: 'POST', // POST digunakan untuk update sesuai API di route admin
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          map_lat: parseFloat(formData.map_lat),
          map_lng: parseFloat(formData.map_lng),
          map_zoom: parseInt(formData.map_zoom),
          map_geojson: formData.map_geojson
        })
      });

      if (!res.ok) throw new Error('Gagal menyimpan pengaturan peta');
      setMessage('Berhasil! Pengaturan peta wilayah berhasil disimpan.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Memuat data...</div>;
  }

  const mapCenter = [parseFloat(formData.map_lat) || 0, parseFloat(formData.map_lng) || 0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <h1 className="text-2xl font-bold text-primary">Kelola Peta Wilayah</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Atur koordinat pusat desa dan batas wilayah menggunakan format GeoJSON. Peta akan muncul secara interaktif di halaman beranda.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('Berhasil') ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Pengaturan */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold mb-1.5 text-on-surface">Latitude (Garis Lintang)</label>
              <input
                type="number"
                step="any"
                name="map_lat"
                value={formData.map_lat}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1.5 text-on-surface">Longitude (Garis Bujur)</label>
              <input
                type="number"
                step="any"
                name="map_lng"
                value={formData.map_lng}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-on-surface">Zoom Level</label>
              <input
                type="number"
                name="map_zoom"
                value={formData.map_zoom}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-2 bg-surface rounded-xl border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5 text-on-surface">Data Batas Desa (GeoJSON)</label>
              <p className="text-xs text-on-surface-variant mb-2">Opsional. Format JSON untuk menggambar batas area poligon.</p>
              <textarea
                name="map_geojson"
                value={formData.map_geojson}
                onChange={handleChange}
                rows="6"
                placeholder='{"type": "FeatureCollection", "features": [...]}'
                className="w-full px-4 py-2 bg-surface rounded-xl border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>

          </form>
        </div>

        {/* Live Preview Peta */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span> Pratinjau Langsung
          </h2>
          
          <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-outline-variant/20 relative z-0">
            <MapContainer center={mapCenter} zoom={parseInt(formData.map_zoom) || 13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={mapCenter} zoom={parseInt(formData.map_zoom) || 13} />
              
              {/* Render titik marker di tengah */}
              <Marker position={mapCenter}></Marker>

              {/* Render poligon GeoJSON jika valid */}
              {geoJsonData && (
                <GeoJSON 
                  key={JSON.stringify(geoJsonData).length} 
                  data={geoJsonData} 
                  style={{
                    color: '#2563eb', // primary blue
                    weight: 2,
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2
                  }}
                />
              )}
            </MapContainer>
          </div>
          
        </div>
      </div>
    </div>
  );
}
