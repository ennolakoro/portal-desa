import { useState, useEffect, useCallback, useRef } from 'react';

const API = 'http://localhost:8000/api/v1/admin';

export default function KelolaFotoSliderForm({ token }) {
  const [slides, setSlides]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview]     = useState(null);
  const fileRef                   = useRef();

  const [form, setForm] = useState({
    caption: '',
    urutan: '',
    aktif: true,
    image: null,
  });

  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/foto-slider`, { headers });
      const json = await res.json();
      setSlides(Array.isArray(json) ? json : []);
    } catch {
      showToast('Gagal memuat data slider.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ caption: '', urutan: '', aktif: true, image: null });
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (slide) => {
    setEditTarget(slide);
    setForm({ caption: slide.caption || '', urutan: slide.urutan, aktif: slide.aktif, image: null });
    setPreview(slide.image_url);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editTarget && !form.image) return showToast('Pilih foto terlebih dahulu.', 'error');
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.image) fd.append('image', form.image);
      fd.append('caption', form.caption);
      fd.append('urutan', form.urutan || '0');
      fd.append('aktif', form.aktif ? '1' : '0');

      const url    = editTarget ? `${API}/foto-slider/${editTarget.id}` : `${API}/foto-slider`;
      const res    = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, body: fd });
      const json   = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan');
      showToast(editTarget ? 'Slider berhasil diperbarui.' : 'Slider berhasil ditambahkan.');
      setShowModal(false);
      fetchSlides();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/foto-slider/${deleteTarget.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Gagal menghapus');
      showToast('Slider berhasil dihapus.');
      setDeleteTarget(null);
      fetchSlides();
    } catch {
      showToast('Gagal menghapus slider.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold animate-fade-in ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Kelola Foto Slider</h2>
          <p className="text-sm text-on-surface-variant">Atur foto yang tampil sebagai slideshow di halaman utama</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
          Tambah Foto
        </button>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 bg-primary-fixed/20 border border-primary/20 text-primary rounded-xl p-4 text-sm">
        <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">info</span>
        <span>Foto slider otomatis berganti setiap 4 detik di halaman utama. Urutkan dengan kolom <strong>Urutan</strong> (angka lebih kecil tampil lebih dulu).</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span className="font-medium text-sm">Memuat...</span>
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3 border-2 border-dashed border-outline-variant/40 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-outline/40">add_photo_alternate</span>
          <p className="font-semibold text-sm">Belum ada foto slider. Klik "Tambah Foto" untuk mulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-video bg-surface-container-high overflow-hidden">
                <img src={slide.image_url} alt={slide.caption || 'Slider'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-primary text-on-primary text-[10px] font-black px-2.5 py-1 rounded-full"># {slide.urutan}</span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${slide.aktif ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
                    {slide.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              {/* Footer */}
              <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-on-surface truncate flex-1">{slide.caption || <span className="italic text-on-surface-variant">Tanpa keterangan</span>}</p>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEdit(slide)} className="p-2 rounded-lg text-primary hover:bg-primary-fixed/30 transition-all cursor-pointer" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button onClick={() => setDeleteTarget(slide)} className="p-2 rounded-lg text-error hover:bg-error/10 transition-all cursor-pointer" title="Hapus">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h3 className="text-lg font-extrabold text-primary">{editTarget ? 'Edit Foto Slider' : 'Tambah Foto Slider'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Upload area */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Foto {!editTarget && <span className="text-error">*</span>}</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${preview ? 'border-primary/40 bg-surface-container' : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-low'}`}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-outline">add_photo_alternate</span>
                      <p className="text-sm text-on-surface-variant mt-2 font-medium">Klik untuk pilih foto</p>
                      <p className="text-xs text-on-surface-variant/70">JPG, PNG, WebP — maks 5 MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {preview && (
                  <button onClick={() => { setPreview(null); setForm(f => ({ ...f, image: null })); if (fileRef.current) fileRef.current.value = ''; }}
                    className="mt-2 text-xs text-error font-semibold cursor-pointer hover:underline">
                    Hapus foto yang dipilih
                  </button>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Keterangan Foto</label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  placeholder={"Baris 1: Nama / Judul (tebal)\nBaris 2: Jabatan / Sub-keterangan (opsional)"}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
                <p className="text-[10px] text-on-surface-variant mt-1">💡 Baris pertama akan tampil <strong>tebal</strong> sebagai judul. Baris kedua sebagai sub-keterangan kecil di bawahnya.</p>
              </div>

              {/* Urutan + Aktif */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Urutan</label>
                  <input
                    type="number"
                    min="0"
                    value={form.urutan}
                    onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))}
                    placeholder="0"
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={form.aktif ? '1' : '0'}
                    onChange={e => setForm(f => ({ ...f, aktif: e.target.value === '1' }))}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant/30 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl border border-outline-variant/30 font-bold text-sm hover:bg-surface-container transition-all cursor-pointer">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all cursor-pointer">
                {saving && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              {deleteTarget.image_url && <img src={deleteTarget.image_url} alt="" className="w-full aspect-video object-cover rounded-xl mb-1" />}
              <div>
                <h3 className="text-lg font-extrabold text-on-surface">Hapus Foto Slider?</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  {deleteTarget.caption ? `"${deleteTarget.caption}"` : 'Foto ini'} akan dihapus permanen.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 h-11 rounded-xl border border-outline-variant/30 font-bold text-sm hover:bg-surface-container transition-all cursor-pointer">Batal</button>
              <button onClick={handleDelete} className="flex-1 h-11 rounded-xl bg-error text-white font-bold text-sm hover:bg-error/90 transition-all cursor-pointer">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
