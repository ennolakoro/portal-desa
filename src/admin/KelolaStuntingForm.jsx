import { useState, useEffect, useCallback } from 'react';

const EMPTY_FORM = {
  total_balita: 0, balita_normal: 0, balita_stunting: 0, balita_gizi_buruk: 0,
  kasus_pantai: 0, kasus_kampung_baru: 0, kasus_pemukiman: 0,
  umur_0_12_normal: 0, umur_0_12_stunting: 0,
  umur_13_24_normal: 0, umur_13_24_stunting: 0,
  umur_25_36_normal: 0, umur_25_36_stunting: 0,
  umur_37_60_normal: 0, umur_37_60_stunting: 0,
};

const currentYear = new Date().getFullYear();
// 5 tahun ke belakang s/d 20 tahun ke depan
const yearOptions = Array.from({ length: 26 }, (_, i) => String(currentYear + 20 - i));


export default function KelolaStuntingForm({ token }) {
  // ── view: 'list' | 'form' ──────────────────────────────────────────────
  const [view, setView]           = useState('list');
  const [editTahun, setEditTahun] = useState(null); // null = new record

  // ── list state ─────────────────────────────────────────────────────────
  const [records, setRecords]         = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  // ── form state ─────────────────────────────────────────────────────────
  const [tahun, setTahun]     = useState(String(currentYear));
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [message, setMessage]         = useState('');

  // ── fetch all records ──────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/stunting-stats', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.status === 401) { localStorage.removeItem('adminToken'); window.location.reload(); return; }
      const data = await res.json();
      setRecords(Array.isArray(data) ? data.sort((a, b) => b.tahun - a.tahun) : []);
    } catch { /* silent */ }
    finally { setListLoading(false); }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── open create form ───────────────────────────────────────────────────
  const openCreate = () => {
    setEditTahun(null);
    setTahun(String(currentYear));
    setFormData(EMPTY_FORM);
    setMessage('');
    setView('form');
  };

  // ── open edit form ─────────────────────────────────────────────────────
  const openEdit = (rec) => {
    setEditTahun(rec.tahun);
    setTahun(rec.tahun);
    const { tahun: _t, id, created_at, updated_at, ...rest } = rec;
    setFormData({ ...EMPTY_FORM, ...rest });
    setMessage('');
    setView('form');
  };

  // ── form field change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // ── computed derived values ────────────────────────────────────────────
  const prevalence = formData.total_balita > 0
    ? ((formData.balita_stunting / formData.total_balita) * 100).toFixed(1)
    : '0.0';

  // ── submit (create / update) ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/stunting-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...formData, tahun })
      });
      if (res.status === 401) { localStorage.removeItem('adminToken'); window.location.reload(); return; }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menyimpan data');
      }
      setMessage('success:Data stunting berhasil disimpan!');
      await fetchAll();
      setTimeout(() => { setMessage(''); setView('list'); }, 1500);
    } catch (err) {
      setMessage(`error:${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`https://api.desadumbayabulan.my.id/api/v1/admin/stunting-stats/${deleteTarget.tahun}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) { await fetchAll(); setDeleteTarget(null); }
      else setMessage('error:Gagal menghapus data.');
    } catch {
      setMessage('error:Terjadi kesalahan jaringan.');
    } finally {
      setDeleting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════
  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">KELOLA MONITORING STUNTING</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tren prevalensi dihitung otomatis dari data nyata setiap tahun.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Tambah Data Tahun Baru
          </button>
        </div>

        {/* Trend Preview Bar */}
        {records.length > 1 && (
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-5">
            <p className="text-xs font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-lg">trending_down</span>
              Tren Prevalensi Stunting (dari data nyata)
            </p>
            <div className="flex items-end gap-3 h-24">
              {[...records].sort((a, b) => a.tahun - b.tahun).map((r) => {
                const pct = r.total_balita > 0 ? (r.balita_stunting / r.total_balita) * 100 : 0;
                const maxH = 80;
                const barH = Math.max(8, (pct / 30) * maxH);
                const color = pct > 20 ? 'bg-red-400' : pct > 10 ? 'bg-amber-400' : 'bg-emerald-400';
                return (
                  <div key={r.tahun} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[10px] font-black text-on-surface-variant">{pct.toFixed(1)}%</span>
                    <div className={`w-full rounded-t-lg ${color} transition-all`} style={{ height: barH }}></div>
                    <span className="text-[10px] font-bold text-outline">{r.tahun}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-outline mt-2">* Tinggi bar mewakili persentase balita stunting dari total yang diperiksa.</p>
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          {listLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl text-outline/40 mb-2 block">child_care</span>
              <p className="font-semibold">Belum ada data stunting</p>
              <p className="text-xs mt-1">Klik "Tambah Data Tahun Baru" untuk memulai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-primary/5 text-primary text-xs font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Tahun</th>
                    <th className="px-5 py-3 text-right">Total Balita</th>
                    <th className="px-5 py-3 text-right text-green-600">Normal</th>
                    <th className="px-5 py-3 text-right text-amber-600">Stunting</th>
                    <th className="px-5 py-3 text-right text-red-600">Gizi Buruk</th>
                    <th className="px-5 py-3 text-center">Prevalensi</th>
                    <th className="px-5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {records.map((rec) => {
                    const pct = rec.total_balita > 0
                      ? ((rec.balita_stunting / rec.total_balita) * 100).toFixed(1)
                      : '0.0';
                    const pctNum = parseFloat(pct);
                    return (
                      <tr key={rec.tahun} className="hover:bg-primary/5 transition-colors">
                        <td className="px-5 py-4 font-black text-primary text-base">{rec.tahun}</td>
                        <td className="px-5 py-4 text-right font-semibold">{rec.total_balita}</td>
                        <td className="px-5 py-4 text-right font-semibold text-green-600">{rec.balita_normal}</td>
                        <td className="px-5 py-4 text-right font-semibold text-amber-600">{rec.balita_stunting}</td>
                        <td className="px-5 py-4 text-right font-semibold text-red-600">{rec.balita_gizi_buruk}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            pctNum > 20 ? 'bg-red-100 text-red-700' :
                            pctNum > 10 ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>{pct}%</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEdit(rec)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(rec)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirm Dialog */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
                <div>
                  <h4 className="font-extrabold text-on-surface">Hapus Data Stunting?</h4>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Data tahun <strong>{deleteTarget.tahun}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-outline-variant rounded-xl font-bold cursor-pointer hover:bg-surface"
                >Batal</button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // FORM VIEW (Create / Edit)
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            className="p-2 rounded-xl hover:bg-surface-container border border-outline-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">
              {editTahun ? `EDIT DATA STUNTING ${editTahun}` : 'TAMBAH DATA STUNTING BARU'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Tren akan dihitung otomatis dari nilai <strong>Jumlah Indikasi Stunting</strong> setiap tahun.
            </p>
          </div>
        </div>

        {/* Live Prevalence Badge */}
        <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-xl text-center shrink-0">
          <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Prevalensi Saat Ini</p>
          <p className="text-2xl font-black text-amber-700">{prevalence}%</p>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
          message.startsWith('success')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <span className="material-symbols-outlined">
            {message.startsWith('success') ? 'check_circle' : 'error'}
          </span>
          {message.split(':')[1]}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Year selector (only when creating) */}
        {!editTahun && (
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
            <div className="flex-1">
              <label className="block text-xs font-extrabold text-outline uppercase tracking-wider mb-1">
                Tahun Pengamatan
              </label>
              <select
                value={tahun}
                onChange={e => setTahun(e.target.value)}
                className="w-full max-w-xs h-11 px-4 border border-outline-variant rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {records.some(r => r.tahun === tahun) && (
              <div className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">warning</span>
                Data tahun ini sudah ada, akan ditimpa.
              </div>
            )}
          </div>
        )}

        {/* Section 1: Ringkasan */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 lg:p-8 space-y-5">
          <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">summarize</span>
            Ringkasan Jumlah & Status Gizi Balita
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Balita Diperiksa', name: 'total_balita', color: '' },
              { label: 'Tumbuh Normal', name: 'balita_normal', color: 'text-green-600' },
              { label: 'Indikasi Stunting', name: 'balita_stunting', color: 'text-amber-600' },
              { label: 'Gizi Buruk', name: 'balita_gizi_buruk', color: 'text-red-600' },
            ].map(f => (
              <div key={f.name} className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wide block ${f.color || 'text-outline'}`}>{f.label}</label>
                <input
                  type="number" name={f.name} value={formData[f.name]}
                  onChange={handleChange} min="0" required
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
                />
              </div>
            ))}
          </div>
          {/* Balance check */}
          <div className={`text-xs font-bold flex justify-between border-t pt-2 ${
            formData.balita_normal + formData.balita_stunting + formData.balita_gizi_buruk === formData.total_balita
              ? 'text-green-600' : 'text-amber-600'
          }`}>
            <span>Jumlah Normal + Stunting + Gizi Buruk:</span>
            <span>{formData.balita_normal + formData.balita_stunting + formData.balita_gizi_buruk} / {formData.total_balita} balita</span>
          </div>
        </div>

        {/* Section 2: Sebaran Dusun */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 lg:p-8 space-y-5">
          <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">map</span>
            Sebaran Kasus Rawan per Dusun
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Dusun Pantai', name: 'kasus_pantai' },
              { label: 'Dusun Kampung Baru', name: 'kasus_kampung_baru' },
              { label: 'Dusun Pemukiman', name: 'kasus_pemukiman' },
            ].map(f => (
              <div key={f.name} className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wide block">{f.label}</label>
                <input
                  type="number" name={f.name} value={formData[f.name]}
                  onChange={handleChange} min="0" required
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
                />
              </div>
            ))}
          </div>
          <div className={`text-xs font-bold flex justify-between border-t pt-2 ${
            formData.kasus_pantai + formData.kasus_kampung_baru + formData.kasus_pemukiman === formData.balita_stunting
              ? 'text-green-600' : 'text-amber-600'
          }`}>
            <span>Total kasus per dusun:</span>
            <span>{formData.kasus_pantai + formData.kasus_kampung_baru + formData.kasus_pemukiman} / {formData.balita_stunting} kasus stunting</span>
          </div>
        </div>

        {/* Section 3: Kelompok Usia */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 lg:p-8 space-y-5">
          <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">calendar_month</span>
            Breakdown Status Gizi per Kelompok Usia
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { group: '0–12 Bulan', n: 'umur_0_12_normal', s: 'umur_0_12_stunting' },
              { group: '13–24 Bulan', n: 'umur_13_24_normal', s: 'umur_13_24_stunting' },
              { group: '25–36 Bulan', n: 'umur_25_36_normal', s: 'umur_25_36_stunting' },
              { group: '37–60 Bulan', n: 'umur_37_60_normal', s: 'umur_37_60_stunting' },
            ].map(g => (
              <div key={g.group} className="space-y-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-extrabold text-xs text-primary block">{g.group}</span>
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase">Normal</label>
                  <input
                    type="number" name={g.n} value={formData[g.n]}
                    onChange={handleChange} min="0" required
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant text-xs mt-1 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-amber-600 uppercase">Stunting / Rawan</label>
                  <input
                    type="number" name={g.s} value={formData[g.s]}
                    onChange={handleChange} min="0" required
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant text-xs mt-1 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Trend Info Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-start gap-3">
          <span className="material-symbols-outlined text-teal-600 text-2xl shrink-0">info</span>
          <div>
            <p className="font-extrabold text-teal-700 text-sm">Tren Prevalensi Tahunan — Dihitung Otomatis</p>
            <p className="text-xs text-teal-600 mt-1">
              Grafik tren pada halaman publik <strong>/infografis/stunting</strong> dihitung secara dinamis
              dari nilai <em>Jumlah Indikasi Stunting</em> dan <em>Total Balita</em> setiap tahun yang tersimpan.
              Tidak perlu input manual — cukup pastikan data setiap tahun sudah benar.
            </p>
            {records.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {[...records].sort((a,b) => a.tahun - b.tahun).map(r => {
                  const p = r.total_balita > 0 ? ((r.balita_stunting / r.total_balita)*100).toFixed(1) : '0.0';
                  return (
                    <span key={r.tahun} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                      {r.tahun}: {p}%
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setView('list')}
            className="px-6 h-12 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving || formLoading}
            className="px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>Menyimpan...</>
            ) : (
              <><span className="material-symbols-outlined text-base">save</span>
              {editTahun ? 'Perbarui Data' : 'Simpan Data Baru'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
