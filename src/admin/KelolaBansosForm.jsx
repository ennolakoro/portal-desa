import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8000/api/v1/admin';

const STATUS_OPTIONS = ['Penerima Aktif', 'Tidak Aktif', 'Dalam Verifikasi'];
const PROGRAM_OPTIONS = ['Terdaftar', 'Tidak Terdaftar'];

const PROGRAM_META = {
  pkh:   { label: 'PKH',          color: 'bg-blue-100 text-blue-700',   icon: 'family_restroom' },
  bpnt:  { label: 'BPNT',         color: 'bg-green-100 text-green-700', icon: 'grocery' },
  blt:   { label: 'BLT Dana Desa',color: 'bg-amber-100 text-amber-700', icon: 'payments' },
  bulog: { label: 'Bulog',        color: 'bg-purple-100 text-purple-700',icon: 'local_shipping' },
};

const DUSUN_MAP = {
  1: 'Dusun Buwoto',
  2: 'Dusun Dilipoga',
  3: 'Dusun Tapalu',
};


const emptyForm = {
  nama: '', dusun_id: '1', status: 'Penerima Aktif',
  pkh: 'Tidak Terdaftar', bpnt: 'Tidak Terdaftar',
  blt: 'Tidak Terdaftar', bulog: 'Tidak Terdaftar',
};

export default function KelolaBansosForm({ token }) {
  const [data, setData]         = useState([]);
  const [meta, setMeta]         = useState(null);
  const [dusuns, setDusuns]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [dusunFilter, setDusunFilter] = useState('');
  const [page, setPage]         = useState(1);
  const [globalStats, setGlobalStats] = useState({ pkh: 0, bpnt: 0, blt: 0, bulog: 0 });

  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (search)     params.set('search', search);
      if (dusunFilter) params.set('dusun_id', dusunFilter);

      const res  = await fetch(`${API}/bansos?${params}`, { headers });
      const json = await res.json();
      setData(json.data || []);
      setMeta(json);
    } catch {
      showToast('Gagal memuat data bansos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, dusunFilter, token]);

  const fetchDusuns = async () => {
    try {
      const res  = await fetch(`${API}/dusun-options`, { headers });
      const json = await res.json();
      const mapped = json.map(d => ({ ...d, nama_dusun: DUSUN_MAP[d.id] || d.nama_dusun }));
      setDusuns(mapped);
    } catch {}
  };

  const fetchGlobalStats = async () => {
    try {
      const res  = await fetch('http://localhost:8000/api/v1/layanan/bansos-summary');
      const json = await res.json();
      if (res.ok) setGlobalStats(json);
    } catch {}
  };

  useEffect(() => { fetchDusuns(); fetchGlobalStats(); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(); }, 400);
    return () => clearTimeout(t);
  }, [search, dusunFilter]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setForm({
      nama:     item.penduduk?.nama || '',
      dusun_id: String(item.penduduk?.dusun_id || '1'),
      status:   item.status,
      pkh:      item.pkh,
      bpnt:     item.bpnt,
      blt:      item.blt,
      bulog:    item.bulog,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim()) return showToast('Nama warga wajib diisi.', 'error');
    setSaving(true);
    try {
      let res;
      if (editTarget) {
        res = await fetch(`${API}/bansos/${editTarget.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            status: form.status,
            pkh: form.pkh, bpnt: form.bpnt,
            blt: form.blt, bulog: form.bulog,
          }),
        });
      } else {
        res = await fetch(`${API}/bansos`, {
          method: 'POST',
          headers,
          body: JSON.stringify(form),
        });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan');
      showToast(editTarget ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.');
      setShowModal(false);
      fetchData();
      fetchGlobalStats();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/bansos/${deleteTarget.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Gagal menghapus');
      showToast('Data berhasil dihapus.');
      setDeleteTarget(null);
      fetchData();
      fetchGlobalStats();
    } catch {
      showToast('Gagal menghapus data.', 'error');
    }
  };

  const ProgramBadge = ({ value, program }) => {
    const isRegistered = value !== 'Tidak Terdaftar';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
        isRegistered ? PROGRAM_META[program].color : 'bg-surface-container text-on-surface-variant/50'
      }`}>
        {isRegistered ? '✓' : '–'} {PROGRAM_META[program].label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold transition-all animate-fade-in ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Kelola Bansos</h2>
          <p className="text-sm text-on-surface-variant">Manajemen data penerima Bantuan Sosial Desa Dumbaya Bulan</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Penerima
        </button>
      </div>

      {/* Summary Cards — data total dari DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(PROGRAM_META).map(([key, m]) => (
          <div key={key} className="bg-white rounded-xl p-5 border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-black text-primary">{globalStats[key]} <span className="text-xs font-normal text-on-surface-variant">KPM</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-outline-variant/30 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        <div className="relative w-full md:w-56">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">pin_drop</span>
          <select
            value={dusunFilter}
            onChange={e => { setDusunFilter(e.target.value); setPage(1); }}
            className="w-full h-11 pl-10 pr-8 rounded-xl border border-outline-variant/30 bg-white text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Dusun</option>
            {dusuns.map(d => <option key={d.id} value={d.id}>{d.nama_dusun}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">expand_more</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="font-medium text-sm">Memuat data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-5xl text-outline/40">inbox</span>
            <p className="font-semibold text-sm">Belum ada data penerima bansos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="text-left px-5 py-3.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Nama Warga</th>
                  <th className="text-left px-4 py-3.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Dusun</th>
                  <th className="text-left px-4 py-3.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Program</th>
                  <th className="text-center px-4 py-3.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-on-surface">{item.penduduk?.nama || '-'}</p>
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant font-medium">
                      {item.penduduk?.dusun_id ? DUSUN_MAP[item.penduduk.dusun_id] || item.penduduk?.dusun?.nama_dusun : item.penduduk?.dusun?.nama_dusun || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'Penerima Aktif' ? 'bg-green-100 text-green-700' :
                        item.status === 'Tidak Aktif' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <ProgramBadge value={item.pkh}   program="pkh" />
                        <ProgramBadge value={item.bpnt}  program="bpnt" />
                        <ProgramBadge value={item.blt}   program="blt" />
                        <ProgramBadge value={item.bulog} program="bulog" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg text-primary hover:bg-primary-fixed/30 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 rounded-lg text-error hover:bg-error/10 transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-on-surface-variant">
            Menampilkan {meta.from}–{meta.to} dari {meta.total} data
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-outline-variant/30 font-bold disabled:opacity-40 hover:bg-surface-container transition-all cursor-pointer"
            >‹ Sebelumnya</button>
            <button
              disabled={page >= meta.last_page}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-outline-variant/30 font-bold disabled:opacity-40 hover:bg-surface-container transition-all cursor-pointer"
            >Selanjutnya ›</button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <div>
                <h3 className="text-lg font-extrabold text-primary">
                  {editTarget ? 'Edit Data Penerima' : 'Tambah Penerima Bansos'}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {editTarget ? 'Perbarui data kepesertaan bansos warga' : 'Daftarkan warga sebagai penerima bansos'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nama Lengkap Warga</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                  disabled={!!editTarget}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:bg-surface-container disabled:cursor-not-allowed"
                  placeholder="Masukkan nama lengkap..."
                />
                {editTarget && <p className="text-[10px] text-on-surface-variant mt-1">Nama tidak dapat diubah setelah terdaftar.</p>}
              </div>

              {/* Dusun */}
              {!editTarget && (
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Dusun</label>
                  <select
                    value={form.dusun_id}
                    onChange={e => setForm(f => ({ ...f, dusun_id: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant/30 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                  >
                    {dusuns.map(d => <option key={d.id} value={d.id}>{d.nama_dusun}</option>)}
                  </select>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Status Kepesertaan</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant/30 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Program Bansos */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Program Bantuan Sosial</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(PROGRAM_META).map(([key, m]) => (
                    <div key={key} className={`p-4 rounded-xl border-2 transition-all ${
                      form[key] !== 'Tidak Terdaftar'
                        ? 'border-primary bg-primary-fixed/10'
                        : 'border-outline-variant/30 bg-surface-container-lowest'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`material-symbols-outlined text-lg ${form[key] !== 'Tidak Terdaftar' ? 'text-primary' : 'text-outline'}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                        <span className="text-sm font-bold text-on-surface">{m.label}</span>
                      </div>
                      <select
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border border-outline-variant/30 text-xs font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white cursor-pointer"
                      >
                        {PROGRAM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 rounded-xl border border-outline-variant/30 font-bold text-sm hover:bg-surface-container transition-all cursor-pointer"
              >Batal</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {saving && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                {saving ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-3xl">delete_forever</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-on-surface">Hapus Data Bansos</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Hapus data penerima bansos atas nama <span className="font-bold text-primary">{deleteTarget.penduduk?.nama}</span>?
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl border border-outline-variant/30 font-bold text-sm hover:bg-surface-container transition-all cursor-pointer"
              >Batal</button>
              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-xl bg-error text-white font-bold text-sm hover:bg-error/90 transition-all cursor-pointer"
              >Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
