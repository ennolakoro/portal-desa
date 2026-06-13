import { useState, useEffect } from 'react';

export default function KelolaKunjunganForm({ token }) {
  const [formData, setFormData] = useState({
    hari_ini: 0,
    kemarin: 0,
    minggu_ini: 0,
    minggu_lalu: 0,
    bulan_ini: 0,
    bulan_lalu: 0,
    total: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/visitor-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          hari_ini: data.hari_ini || 0,
          kemarin: data.kemarin || 0,
          minggu_ini: data.minggu_ini || 0,
          minggu_lalu: data.minggu_lalu || 0,
          bulan_ini: data.bulan_ini || 0,
          bulan_lalu: data.bulan_lalu || 0,
          total: data.total || 0
        });
      }
    } catch (err) {
      console.error('Gagal mengambil data statistik kunjungan', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/visitor-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Gagal memperbarui data statistik kunjungan');
      setMessage('success:Berhasil memperbarui statistik kunjungan!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(`error:${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">KELOLA STATISTIK KUNJUNGAN</h2>
          <p className="text-xs text-on-surface-variant font-medium">Override data penonton dan hit website desa</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
          message.startsWith('success') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <span className="material-symbols-outlined">
            {message.startsWith('success') ? 'check_circle' : 'error'}
          </span>
          <span>{message.split(':')[1]}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Hari Ini</label>
              <input
                type="number"
                name="hari_ini"
                value={formData.hari_ini}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Kemarin</label>
              <input
                type="number"
                name="kemarin"
                value={formData.kemarin}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Minggu Ini</label>
              <input
                type="number"
                name="minggu_ini"
                value={formData.minggu_ini}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Minggu Lalu</label>
              <input
                type="number"
                name="minggu_lalu"
                value={formData.minggu_lalu}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Bulan Ini</label>
              <input
                type="number"
                name="bulan_ini"
                value={formData.bulan_ini}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Bulan Lalu</label>
              <input
                type="number"
                name="bulan_lalu"
                value={formData.bulan_lalu}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold"
              />
            </div>

            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Total Kunjungan Keseluruhan</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                min="0"
                required
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 h-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-55"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
