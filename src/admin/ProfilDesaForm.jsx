import { useState, useEffect } from 'react';

export default function ProfilDesaForm({ token }) {
  const [data, setData] = useState({
    visi: '',
    misi: [],
    sejarah: '',
    luas_wilayah: '',
    populasi_sementara: '',
    batas_utara: '',
    batas_timur: '',
    batas_selatan: '',
    batas_barat: '',
    bagan_pemerintahan_url: '',
    bagan_bpd_url: '',
    peta_wilayah_url: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [filePemerintahan, setFilePemerintahan] = useState(null);
  const [fileBPD, setFileBPD] = useState(null);
  const [previewPemerintahan, setPreviewPemerintahan] = useState('');
  const [previewBPD, setPreviewBPD] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/profil-desa', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const json = await res.json();
      if (res.ok) {
        setData({
          visi: json.visi || '',
          misi: Array.isArray(json.misi) ? json.misi : [],
          sejarah: json.sejarah || '',
          luas_wilayah: json.luas_wilayah || '',
          populasi_sementara: json.populasi_sementara || '',
          batas_utara: json.batas_utara || '',
          batas_timur: json.batas_timur || '',
          batas_selatan: json.batas_selatan || '',
          batas_barat: json.batas_barat || '',
          bagan_pemerintahan_url: json.bagan_pemerintahan_url || '',
          bagan_bpd_url: json.bagan_bpd_url || '',
          peta_wilayah_url: json.peta_wilayah_url || '',
        });
        setPreviewPemerintahan(json.bagan_pemerintahan_url || '');
        setPreviewBPD(json.bagan_bpd_url || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMisiChange = (index, value) => {
    const newMisi = [...data.misi];
    newMisi[index] = value;
    setData({ ...data, misi: newMisi });
  };

  const addMisi = () => {
    setData({ ...data, misi: [...data.misi, ''] });
  };

  const removeMisi = (index) => {
    const newMisi = data.misi.filter((_, i) => i !== index);
    setData({ ...data, misi: newMisi });
  };

  const handleFilePemerintahanChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilePemerintahan(file);
      setPreviewPemerintahan(URL.createObjectURL(file));
    }
  };

  const handleFileBPDChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileBPD(file);
      setPreviewBPD(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const uploadData = new FormData();
    uploadData.append('visi', data.visi);
    uploadData.append('misi', JSON.stringify(data.misi));
    uploadData.append('sejarah', data.sejarah);
    uploadData.append('luas_wilayah', data.luas_wilayah);
    uploadData.append('populasi_sementara', data.populasi_sementara);
    uploadData.append('batas_utara', data.batas_utara);
    uploadData.append('batas_timur', data.batas_timur);
    uploadData.append('batas_selatan', data.batas_selatan);
    uploadData.append('batas_barat', data.batas_barat);
    uploadData.append('peta_wilayah_url', data.peta_wilayah_url);

    if (filePemerintahan) {
      uploadData.append('file_bagan_pemerintahan', filePemerintahan);
    } else {
      uploadData.append('bagan_pemerintahan_url', data.bagan_pemerintahan_url);
    }

    if (fileBPD) {
      uploadData.append('file_bagan_bpd', fileBPD);
    } else {
      uploadData.append('bagan_bpd_url', data.bagan_bpd_url);
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/profil-desa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: uploadData
      });
      
      const json = await res.json();
      if (res.ok) {
        setMessage('Profil Desa berhasil disimpan!');
        const updated = json.data;
        setData({
          visi: updated.visi || '',
          misi: Array.isArray(updated.misi) ? updated.misi : [],
          sejarah: updated.sejarah || '',
          luas_wilayah: updated.luas_wilayah || '',
          populasi_sementara: updated.populasi_sementara || '',
          batas_utara: updated.batas_utara || '',
          batas_timur: updated.batas_timur || '',
          batas_selatan: updated.batas_selatan || '',
          batas_barat: updated.batas_barat || '',
          bagan_pemerintahan_url: updated.bagan_pemerintahan_url || '',
          bagan_bpd_url: updated.bagan_bpd_url || '',
          peta_wilayah_url: updated.peta_wilayah_url || '',
        });
        setPreviewPemerintahan(updated.bagan_pemerintahan_url || '');
        setPreviewBPD(updated.bagan_bpd_url || '');
        setFilePemerintahan(null);
        setFileBPD(null);
      } else {
        setMessage(json.message || 'Gagal menyimpan.');
      }
    } catch (e) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-bold">Memuat data profil...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
      <div className="p-6 border-b border-outline-variant bg-surface-container-lowest">
        <h2 className="text-2xl font-bold text-primary">Pengaturan Profil Desa</h2>
        <p className="text-on-surface-variant text-sm mt-1">Kelola informasi publik Desa Dumbaya Bulan.</p>
      </div>

      {message && (
        <div className="m-6 p-4 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 space-y-8">
        
        {/* Visi Misi Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Visi & Misi</h3>
          
          <div>
            <label className="block text-sm font-bold mb-2">Visi Desa</label>
            <textarea 
              value={data.visi}
              onChange={(e) => setData({...data, visi: e.target.value})}
              className="w-full p-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
              placeholder="Masukkan visi desa..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Misi Desa</label>
            <div className="space-y-3">
              {data.misi.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <span className="bg-surface-container w-10 flex items-center justify-center rounded-xl font-bold text-on-surface-variant">
                    {index + 1}
                  </span>
                  <input 
                    type="text" 
                    value={item}
                    onChange={(e) => handleMisiChange(index, e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Masukkan poin misi..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeMisi(index)}
                    className="bg-error-container text-error p-3 rounded-xl hover:bg-error hover:text-white transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button" 
              onClick={addMisi}
              className="mt-3 flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Tambah Poin Misi
            </button>
          </div>
        </section>

        {/* Sejarah Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Sejarah Desa</h3>
          <div>
            <textarea 
              value={data.sejarah}
              onChange={(e) => setData({...data, sejarah: e.target.value})}
              className="w-full p-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all min-h-[150px]"
              placeholder="Ceritakan sejarah singkat asal-usul Desa Dumbaya Bulan..."
            />
          </div>
        </section>

        {/* Geografi Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Geografi & Batas Wilayah</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Luas Wilayah (Ha)</label>
              <input 
                type="number" 
                step="0.01"
                value={data.luas_wilayah}
                onChange={(e) => setData({...data, luas_wilayah: e.target.value})}
                className="w-full p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Misal: 42.50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Populasi Sementara (Jiwa)</label>
              <input 
                type="number" 
                value={data.populasi_sementara}
                onChange={(e) => setData({...data, populasi_sementara: e.target.value})}
                className="w-full p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Misal: 1429"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-on-surface-variant uppercase">Batas Utara</label>
              <input type="text" value={data.batas_utara} onChange={(e) => setData({...data, batas_utara: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-on-surface-variant uppercase">Batas Timur</label>
              <input type="text" value={data.batas_timur} onChange={(e) => setData({...data, batas_timur: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-on-surface-variant uppercase">Batas Selatan</label>
              <input type="text" value={data.batas_selatan} onChange={(e) => setData({...data, batas_selatan: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-on-surface-variant uppercase">Batas Barat</label>
              <input type="text" value={data.batas_barat} onChange={(e) => setData({...data, batas_barat: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant" />
            </div>
          </div>
        </section>

        {/* Bagan & Struktur Organisasi Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Bagan & Struktur Organisasi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold mb-2">Upload Foto Bagan Pemerintahan Desa</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFilePemerintahanChange}
                  className="w-full p-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden aspect-video bg-surface relative flex items-center justify-center">
                {previewPemerintahan ? (
                  <img 
                    src={previewPemerintahan} 
                    alt="Preview Bagan Pemerintahan" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=Format+Gambar+Tidak+Valid'; }}
                  />
                ) : (
                  <div className="text-center p-4 text-xs text-outline font-bold">
                    <span className="material-symbols-outlined text-3xl block mb-1">image</span>
                    Belum ada bagan (Gunakan default)
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold mb-2">Upload Foto Bagan Badan Permusyawaratan (BPD)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileBPDChange}
                  className="w-full p-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden aspect-video bg-surface relative flex items-center justify-center">
                {previewBPD ? (
                  <img 
                    src={previewBPD} 
                    alt="Preview Bagan BPD" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=Format+Gambar+Tidak+Valid'; }}
                  />
                ) : (
                  <div className="text-center p-4 text-xs text-outline font-bold">
                    <span className="material-symbols-outlined text-3xl block mb-1">image</span>
                    Belum ada bagan (Gunakan default)
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Peta Interaktif Desa Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Peta Interaktif Desa</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-2">URL Gambar Peta Wilayah Desa</label>
              <input 
                type="text" 
                value={data.peta_wilayah_url}
                onChange={(e) => setData({...data, peta_wilayah_url: e.target.value})}
                className="w-full p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all text-xs font-mono"
                placeholder="Masukkan URL peta wilayah desa..."
              />
            </div>
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden aspect-video max-h-[300px] bg-surface relative flex items-center justify-center">
              {data.peta_wilayah_url ? (
                <img 
                  src={data.peta_wilayah_url} 
                  alt="Preview Peta Wilayah" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400?text=Format+Gambar+Peta+Tidak+Valid'; }}
                />
              ) : (
                <div className="text-center p-4 text-xs text-outline font-bold">
                  <span className="material-symbols-outlined text-3xl block mb-1">map</span>
                  Belum ada peta custom (Gunakan default)
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:bg-primary-container hover:text-primary-container-on hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
