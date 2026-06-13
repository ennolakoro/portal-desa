import { useState, useEffect } from 'react';

export default function KelolaPengaturanForm({ token }) {
  const [data, setData] = useState({
    hero_title: '',
    hero_tagline: '',
    footer_alamat_kantor: '',
    footer_detail_alamat: '',
    footer_kode_wilayah: '',
    footer_telepon: '',
    footer_email: '',
    footer_emergency_text: '',
    footer_emergency_phone: '',
    footer_link_kemendesa: '',
    footer_link_kemendagri: '',
    footer_link_dpt: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/desa-setting', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        throw new Error(json.message || 'Gagal memuat pengaturan.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/desa-setting', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setMessage('Pengaturan desa berhasil diperbarui!');
        setData(json.data);
        // Scroll to top to show message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(json.message || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-on-surface-variant font-medium">Memuat data pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pengaturan Portal Desa</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola teks Banner Hero halaman depan serta seluruh isi info Footer.</p>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/25 text-on-error-container p-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-error">error</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Hero Banner */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
          <h3 className="font-extrabold text-lg text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <span className="material-symbols-outlined text-primary-fixed-dim">slideshow</span>
            Banner Utama (Hero)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Judul Banner (Hero Title)</label>
              <input
                type="text"
                name="hero_title"
                value={data.hero_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Masukkan judul banner..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Tagline/Deskripsi Banner</label>
              <textarea
                name="hero_tagline"
                value={data.hero_tagline}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Masukkan deskripsi detail banner..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Footer Contact & Address */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
          <h3 className="font-extrabold text-lg text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <span className="material-symbols-outlined text-primary-fixed-dim">contact_page</span>
            Info Alamat & Kontak Footer
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Label Alamat Kantor</label>
              <input
                type="text"
                name="footer_alamat_kantor"
                value={data.footer_alamat_kantor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Contoh: [Alamat kantor]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Kode Wilayah Desa</label>
              <input
                type="text"
                name="footer_kode_wilayah"
                value={data.footer_kode_wilayah}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Contoh: 75.03.08.2003"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-2">Detail Alamat Kantor</label>
              <textarea
                name="footer_detail_alamat"
                value={data.footer_detail_alamat}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Masukkan alamat lengkap kantor..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Nomor Telepon Desa</label>
              <input
                type="text"
                name="footer_telepon"
                value={data.footer_telepon}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Email Desa resmi</label>
              <input
                type="email"
                name="footer_email"
                value={data.footer_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                placeholder="Contoh: email@desa.id"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Emergency and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Emergency settings */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3 mb-4">
                <span className="material-symbols-outlined text-error">emergency</span>
                Layanan Darurat
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Pemberitahuan / Catatan Darurat</label>
                  <textarea
                    name="footer_emergency_text"
                    value={data.footer_emergency_text}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                    placeholder="Contoh: Hubungi pusat bantuan segera..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Nomor Call Center Darurat</label>
                  <input
                    type="text"
                    name="footer_emergency_phone"
                    value={data.footer_emergency_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Links settings */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
              <span className="material-symbols-outlined text-primary-fixed-dim">link</span>
              Tautan Terkait
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">URL Website Kemendesa</label>
                <input
                  type="text"
                  name="footer_link_kemendesa"
                  value={data.footer_link_kemendesa}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                  placeholder="https://kemendesa.go.id"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">URL Website Kemendagri</label>
                <input
                  type="text"
                  name="footer_link_kemendagri"
                  value={data.footer_link_kemendagri}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                  placeholder="https://kemendagri.go.id"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">URL Cek DPT Online</label>
                <input
                  type="text"
                  name="footer_link_dpt"
                  value={data.footer_link_dpt}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-medium text-sm transition-colors bg-surface-bright"
                  placeholder="https://cekdptonline.kpu.go.id"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={fetchData}
            disabled={saving}
            className="px-6 py-3 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Simpan Perubahan
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
