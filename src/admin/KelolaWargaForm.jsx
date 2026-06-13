import { useState, useEffect } from 'react';

export default function KelolaWargaForm({ token }) {
  const [formData, setFormData] = useState({
    total_kk: 0,
    total_laki: 0,
    total_perempuan: 0,
    dusun_buwoto: 0,
    dusun_dilipoga: 0,
    dusun_tapalu: 0,
    pendidikan_tidak_sekolah: 0,
    pendidikan_sd: 0,
    pendidikan_smp: 0,
    pendidikan_sma: 0,
    pendidikan_diploma: 0,
    pendidikan_sarjana: 0,
    pekerjaan_ibu_rumah_tangga: 0,
    pekerjaan_tidak_bekerja: 0,
    pekerjaan_pelajar_mahasiswa: 0,
    pekerjaan_nelayan: 0,
    pekerjaan_petani: 0,
    pekerjaan_buruh: 0,
    pekerjaan_swasta: 0,
    pekerjaan_wiraswasta: 0,
    pekerjaan_pns: 0,
    agama_islam: 0,
    agama_kristen: 0,
    agama_katolik: 0,
    agama_hindu: 0,
    agama_buddha: 0,
    agama_konghucu: 0,
    umur_0_5_l: 0,
    umur_0_5_p: 0,
    umur_6_10_l: 0,
    umur_6_10_p: 0,
    umur_11_15_l: 0,
    umur_11_15_p: 0,
    umur_16_20_l: 0,
    umur_16_20_p: 0,
    umur_21_25_l: 0,
    umur_21_25_p: 0,
    umur_26_30_l: 0,
    umur_26_30_p: 0,
    umur_31_35_l: 0,
    umur_31_35_p: 0,
    umur_36_40_l: 0,
    umur_36_40_p: 0,
    umur_41_45_l: 0,
    umur_41_45_p: 0,
    umur_46_50_l: 0,
    umur_46_50_p: 0,
    umur_51_55_l: 0,
    umur_51_55_p: 0,
    umur_56_60_l: 0,
    umur_56_60_p: 0,
    umur_61_up_l: 0,
    umur_61_up_p: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Live Auto-calculations
  const calculatedLaki = 
    Number(formData.umur_0_5_l || 0) + 
    Number(formData.umur_6_10_l || 0) + 
    Number(formData.umur_11_15_l || 0) + 
    Number(formData.umur_16_20_l || 0) + 
    Number(formData.umur_21_25_l || 0) + 
    Number(formData.umur_26_30_l || 0) + 
    Number(formData.umur_31_35_l || 0) + 
    Number(formData.umur_36_40_l || 0) + 
    Number(formData.umur_41_45_l || 0) + 
    Number(formData.umur_46_50_l || 0) + 
    Number(formData.umur_51_55_l || 0) + 
    Number(formData.umur_56_60_l || 0) + 
    Number(formData.umur_61_up_l || 0);

  const calculatedPerempuan = 
    Number(formData.umur_0_5_p || 0) + 
    Number(formData.umur_6_10_p || 0) + 
    Number(formData.umur_11_15_p || 0) + 
    Number(formData.umur_16_20_p || 0) + 
    Number(formData.umur_21_25_p || 0) + 
    Number(formData.umur_26_30_p || 0) + 
    Number(formData.umur_31_35_p || 0) + 
    Number(formData.umur_36_40_p || 0) + 
    Number(formData.umur_41_45_p || 0) + 
    Number(formData.umur_46_50_p || 0) + 
    Number(formData.umur_51_55_p || 0) + 
    Number(formData.umur_56_60_p || 0) + 
    Number(formData.umur_61_up_p || 0);

  const calculatedTotal = calculatedLaki + calculatedPerempuan;

  // Sum categories to show helpers
  const calculatedDusun = Number(formData.dusun_buwoto || 0) + Number(formData.dusun_dilipoga || 0) + Number(formData.dusun_tapalu || 0);
  const calculatedPendidikan = 
    Number(formData.pendidikan_tidak_sekolah || 0) + 
    Number(formData.pendidikan_sd || 0) + 
    Number(formData.pendidikan_smp || 0) + 
    Number(formData.pendidikan_sma || 0) + 
    Number(formData.pendidikan_diploma || 0) + 
    Number(formData.pendidikan_sarjana || 0);
  
  const calculatedPekerjaan = 
    Number(formData.pekerjaan_ibu_rumah_tangga || 0) + 
    Number(formData.pekerjaan_tidak_bekerja || 0) + 
    Number(formData.pekerjaan_pelajar_mahasiswa || 0) + 
    Number(formData.pekerjaan_nelayan || 0) + 
    Number(formData.pekerjaan_petani || 0) + 
    Number(formData.pekerjaan_buruh || 0) + 
    Number(formData.pekerjaan_swasta || 0) + 
    Number(formData.pekerjaan_wiraswasta || 0) + 
    Number(formData.pekerjaan_pns || 0);

  const calculatedAgama = 
    Number(formData.agama_islam || 0) + 
    Number(formData.agama_kristen || 0) + 
    Number(formData.agama_katolik || 0) + 
    Number(formData.agama_hindu || 0) + 
    Number(formData.agama_buddha || 0) + 
    Number(formData.agama_konghucu || 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/demografi-summary', {
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
        setFormData(json);
      } else {
        throw new Error(json.message || 'Gagal memuat rekap demografi.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    // Inject calculated sums into payload to ensure database values stay clean
    const payload = {
      ...formData,
      total_laki: calculatedLaki,
      total_perempuan: calculatedPerempuan
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/demografi-summary', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setMessage('Data kependudukan berhasil diperbarui dan disinkronkan!');
        setFormData(json.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(json.message || 'Gagal menyimpan rekap kependudukan.');
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
        <p className="mt-4 text-on-surface-variant font-medium">Memuat rekap kependudukan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Rekapitulasi Kependudukan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Mengelola angka agregat kependudukan. Backend akan mensinkronkan data dummy secara otomatis untuk melindungi privasi warga.</p>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/25 text-on-error-container p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <span className="material-symbols-outlined text-error">error</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Grid: Statistics Overview & Age Pyramid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Summary Cards */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-primary to-primary-container text-white p-6 rounded-3xl shadow-md space-y-4">
                <h3 className="font-extrabold text-base tracking-wide uppercase opacity-75">Kalkulasi Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm opacity-90">Laki-laki:</span>
                    <span className="text-2xl font-black">{calculatedLaki} Jiwa</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm opacity-90">Perempuan:</span>
                    <span className="text-2xl font-black">{calculatedPerempuan} Jiwa</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between items-baseline">
                    <span className="text-sm font-bold">Total Warga:</span>
                    <span className="text-3xl font-black text-primary-fixed">{calculatedTotal} Jiwa</span>
                  </div>
                </div>
              </div>

              {/* General inputs */}
              <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-lg">groups</span>
                  Umum & Wilayah
                </h3>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Jumlah Kepala Keluarga (KK)</label>
                  <input
                    type="number"
                    name="total_kk"
                    value={formData.total_kk}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Dusun Buwoto</label>
                  <input
                    type="number"
                    name="dusun_buwoto"
                    value={formData.dusun_buwoto}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Dusun Dilipoga</label>
                  <input
                    type="number"
                    name="dusun_dilipoga"
                    value={formData.dusun_dilipoga}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Dusun Tapalu</label>
                  <input
                    type="number"
                    name="dusun_tapalu"
                    value={formData.dusun_tapalu}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                  />
                </div>
                <div className="pt-2 text-[11px] font-bold text-right flex justify-between border-t border-outline-variant/10 text-on-surface-variant">
                  <span>Total Dusun:</span>
                  <span className={calculatedDusun === calculatedTotal ? 'text-green-600' : 'text-amber-600'}>
                    {calculatedDusun} / {calculatedTotal} Jiwa
                  </span>
                </div>
              </div>
            </div>

            {/* Age Pyramid settings */}
            <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
              <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim text-lg">bar_chart</span>
                Piramida Penduduk (Berdasarkan Kelompok Umur & Gender)
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-xs font-black uppercase text-outline tracking-wider border-b border-outline-variant/10 pb-2">
                  <div>Kelompok Umur</div>
                  <div className="text-center text-primary-fixed-dim">Laki-laki</div>
                  <div className="text-center text-secondary">Perempuan</div>
                </div>

                {/* Range rows */}
                {[
                  { label: '00 - 05 Tahun', l: 'umur_0_5_l', p: 'umur_0_5_p' },
                  { label: '06 - 10 Tahun', l: 'umur_6_10_l', p: 'umur_6_10_p' },
                  { label: '11 - 15 Tahun', l: 'umur_11_15_l', p: 'umur_11_15_p' },
                  { label: '16 - 20 Tahun', l: 'umur_16_20_l', p: 'umur_16_20_p' },
                  { label: '21 - 25 Tahun', l: 'umur_21_25_l', p: 'umur_21_25_p' },
                  { label: '26 - 30 Tahun', l: 'umur_26_30_l', p: 'umur_26_30_p' },
                  { label: '31 - 35 Tahun', l: 'umur_31_35_l', p: 'umur_31_35_p' },
                  { label: '36 - 40 Tahun', l: 'umur_36_40_l', p: 'umur_36_40_p' },
                  { label: '41 - 45 Tahun', l: 'umur_41_45_l', p: 'umur_41_45_p' },
                  { label: '46 - 50 Tahun', l: 'umur_46_50_l', p: 'umur_46_50_p' },
                  { label: '51 - 55 Tahun', l: 'umur_51_55_l', p: 'umur_51_55_p' },
                  { label: '56 - 60 Tahun', l: 'umur_56_60_l', p: 'umur_56_60_p' },
                  { label: '61+ Tahun', l: 'umur_61_up_l', p: 'umur_61_up_p' },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 items-center border-b border-outline-variant/5 pb-2">
                    <span className="text-xs font-bold text-on-surface">{row.label}</span>
                    <input
                      type="number"
                      name={row.l}
                      value={formData[row.l]}
                      onChange={handleChange}
                      min={0}
                      className="px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-center font-semibold text-sm bg-surface-bright"
                    />
                    <input
                      type="number"
                      name={row.p}
                      value={formData[row.p]}
                      onChange={handleChange}
                      min={0}
                      className="px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-center font-semibold text-sm bg-surface-bright"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pendidikan & Agama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pendidikan */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim text-lg">school</span>
                Tingkat Pendidikan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Tidak Sekolah', field: 'pendidikan_tidak_sekolah' },
                  { label: 'SD / Sederajat', field: 'pendidikan_sd' },
                  { label: 'SMP / Sederajat', field: 'pendidikan_smp' },
                  { label: 'SMA / Sederajat', field: 'pendidikan_sma' },
                  { label: 'Diploma (D1-D4)', field: 'pendidikan_diploma' },
                  { label: 'Sarjana (S1-S3)', field: 'pendidikan_sarjana' },
                ].map((row, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{row.label}</label>
                    <input
                      type="number"
                      name={row.field}
                      value={formData[row.field]}
                      onChange={handleChange}
                      min={0}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[11px] font-bold text-right flex justify-between border-t border-outline-variant/10 text-on-surface-variant">
                <span>Total Kategori Pendidikan:</span>
                <span className={calculatedPendidikan === calculatedTotal ? 'text-green-600' : 'text-amber-600'}>
                  {calculatedPendidikan} / {calculatedTotal} Jiwa
                </span>
              </div>
            </div>

            {/* Agama */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim text-lg">church</span>
                Agama
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Islam', field: 'agama_islam' },
                  { label: 'Kristen', field: 'agama_kristen' },
                  { label: 'Katolik', field: 'agama_katolik' },
                  { label: 'Hindu', field: 'agama_hindu' },
                  { label: 'Buddha', field: 'agama_buddha' },
                  { label: 'Konghucu', field: 'agama_konghucu' },
                ].map((row, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">{row.label}</label>
                    <input
                      type="number"
                      name={row.field}
                      value={formData[row.field]}
                      onChange={handleChange}
                      min={0}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[11px] font-bold text-right flex justify-between border-t border-outline-variant/10 text-on-surface-variant">
                <span>Total Kategori Agama:</span>
                <span className={calculatedAgama === calculatedTotal ? 'text-green-600' : 'text-amber-600'}>
                  {calculatedAgama} / {calculatedTotal} Jiwa
                </span>
              </div>
            </div>

          </div>

          {/* Pekerjaan */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim text-lg">work</span>
              Mata Pencaharian
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Belum / Tidak Bekerja', field: 'pekerjaan_tidak_bekerja' },
                { label: 'Nelayan / Perikanan', field: 'pekerjaan_nelayan' },
                { label: 'Petani / Pekebun', field: 'pekerjaan_petani' },
                { label: 'Ibu Rumah Tangga', field: 'pekerjaan_ibu_rumah_tangga' },
                { label: 'Pelajar / Mahasiswa', field: 'pekerjaan_pelajar_mahasiswa' },
                { label: 'Karyawan Swasta', field: 'pekerjaan_swasta' },
                { label: 'Wiraswasta / Pedagang', field: 'pekerjaan_wiraswasta' },
                { label: 'PNS / TNI / Polri', field: 'pekerjaan_pns' },
                { label: 'Buruh Harian Lepas', field: 'pekerjaan_buruh' },
              ].map((row, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">{row.label}</label>
                  <input
                    type="number"
                    name={row.field}
                    value={formData[row.field]}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary font-semibold text-sm bg-surface-bright"
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 text-[11px] font-bold text-right flex justify-between border-t border-outline-variant/10 text-on-surface-variant">
              <span>Total Kategori Pekerjaan:</span>
              <span className={calculatedPekerjaan === calculatedTotal ? 'text-green-600' : 'text-amber-600'}>
                {calculatedPekerjaan} / {calculatedTotal} Jiwa
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/20">
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
                  Menyimpan & Mensinkronkan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">sync</span>
                  Simpan & Sinkron
                </>
              )}
            </button>
          </div>

        </form>

    </div>
  );
}
