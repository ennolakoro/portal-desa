import { useState, useEffect } from 'react';

export default function KelolaApbdesForm({ token }) {
  const [apbdesList, setApbdesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    tahun: '2024',
    pendapatan_target: '',
    pendapatan_realisasi: '',
    belanja_pagu: '',
    belanja_realisasi: '',
    pembiayaan_penerimaan: '',
    pembiayaan_pengeluaran: '',
  });

  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApbdes();
  }, []);

  const fetchApbdes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/apbdes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      const data = await res.json();
      if (res.ok) {
        setApbdesList(data);
        if (data.length > 0) {
          selectYearData(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const selectYearData = (item) => {
    setFormData({
      tahun: item.tahun,
      pendapatan_target: item.pendapatan_target.toString(),
      pendapatan_realisasi: item.pendapatan_realisasi.toString(),
      belanja_pagu: item.belanja_pagu.toString(),
      belanja_realisasi: item.belanja_realisasi.toString(),
      pembiayaan_penerimaan: item.pembiayaan_penerimaan.toString(),
      pembiayaan_pengeluaran: item.pembiayaan_pengeluaran.toString(),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/apbdes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', text: data.message });
        fetchApbdes();
      } else {
        setAlert({ type: 'error', text: data.message || 'Gagal menyimpan APBDes.' });
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Kesalahan sistem.' });
    }
    setIsSubmitting(false);
  };

  const createNewYear = () => {
    setFormData({
      tahun: (new Date().getFullYear() + 1).toString(),
      pendapatan_target: '0',
      pendapatan_realisasi: '0',
      belanja_pagu: '0',
      belanja_realisasi: '0',
      pembiayaan_penerimaan: '0',
      pembiayaan_pengeluaran: '0',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Kelola Anggaran Desa (APBDes)</h2>
        <p className="text-sm text-on-surface-variant">Update target dan realisasi APBDes Desa Dumbaya Bulan per Tahun Anggaran secara real-time.</p>
      </div>

      {alert && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${
          alert.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {alert.type === 'success' ? 'check_circle' : 'warning'}
            </span>
            <span className="text-sm font-bold">{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="material-symbols-outlined text-sm cursor-pointer opacity-70 hover:opacity-100">
            close
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Years Sidebar */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Tahun Anggaran</h3>
            <button 
              onClick={createNewYear}
              className="text-xs font-black text-primary bg-primary-fixed px-3 py-1.5 rounded-lg hover:brightness-95 transition-all cursor-pointer"
            >
              + Baru
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <span className="material-symbols-outlined text-primary text-2xl animate-spin">sync</span>
            </div>
          ) : apbdesList.length === 0 ? (
            <p className="text-xs text-outline italic text-center py-4">Belum ada data anggaran.</p>
          ) : (
            <div className="space-y-2">
              {apbdesList.map(item => {
                const isActive = formData.tahun === item.tahun;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectYearData(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm cursor-pointer border transition-all ${
                      isActive 
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface hover:bg-surface-container-high border-outline-variant/10 text-on-surface-variant'
                    }`}
                  >
                    <span>Tahun {item.tahun}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary-container text-primary'
                    }`}>
                      Rp {(item.pendapatan_realisasi / 1000000000).toFixed(2)} M
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h3 className="text-base font-extrabold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            Form Input Anggaran Tahun {formData.tahun}
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tahun */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Tahun Anggaran</label>
                <input 
                  type="text" 
                  name="tahun"
                  required
                  value={formData.tahun}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-bold text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: 2025"
                />
              </div>

              {/* Pendapatan Target */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Target Pendapatan (Rupiah)</label>
                <input 
                  type="number" 
                  name="pendapatan_target"
                  required
                  value={formData.pendapatan_target}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-primary"
                  placeholder="Rp..."
                />
              </div>

              {/* Pendapatan Realisasi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Realisasi Pendapatan (Rupiah)</label>
                <input 
                  type="number" 
                  name="pendapatan_realisasi"
                  required
                  value={formData.pendapatan_realisasi}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-primary"
                  placeholder="Rp..."
                />
              </div>

              {/* Belanja Pagu */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Pagu Belanja (Rupiah)</label>
                <input 
                  type="number" 
                  name="belanja_pagu"
                  required
                  value={formData.belanja_pagu}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-error"
                  placeholder="Rp..."
                />
              </div>

              {/* Belanja Realisasi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Realisasi Belanja (Rupiah)</label>
                <input 
                  type="number" 
                  name="belanja_realisasi"
                  required
                  value={formData.belanja_realisasi}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-error"
                  placeholder="Rp..."
                />
              </div>

              {/* Pembiayaan Penerimaan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Penerimaan Pembiayaan (Rupiah)</label>
                <input 
                  type="number" 
                  name="pembiayaan_penerimaan"
                  required
                  value={formData.pembiayaan_penerimaan}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-secondary"
                  placeholder="Rp..."
                />
              </div>

              {/* Pembiayaan Pengeluaran */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">Pengeluaran Pembiayaan (Rupiah)</label>
                <input 
                  type="number" 
                  name="pembiayaan_pengeluaran"
                  required
                  value={formData.pembiayaan_pengeluaran}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-surface rounded-xl border border-outline-variant/50 font-semibold text-sm focus:ring-2 focus:ring-primary text-secondary"
                  placeholder="Rp..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Simpan APBDes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
