import { useState } from 'react';

const SURAT_TYPES = [
  {
    id: 'Surat Keterangan Usaha',
    label: 'Surat Keterangan Usaha (SKU)',
    description: 'Digunakan untuk menerangkan bahwa pemohon memiliki bidang usaha tertentu sebagai syarat pengajuan kredit atau kebutuhan administrasi lainnya.',
    icon: 'storefront'
  },
  {
    id: 'Surat Keterangan Kurang Mampu',
    label: 'Surat Keterangan Kurang Mampu (SKTM)',
    description: 'Menerangkan kondisi ekonomi keluarga pemohon untuk pengajuan bantuan sosial, KIP, pengurangan biaya sekolah/kuliah, atau perawatan rumah sakit.',
    icon: 'workspace_premium'
  },
  {
    id: 'Surat Izin Keramaian',
    label: 'Surat Izin Keramaian',
    description: 'Diperlukan untuk penyelenggaraan acara/kegiatan sosial kemasyarakatan yang melibatkan pengumpulan massa (misalnya: pesta hajatan, konser, pentas seni).',
    icon: 'celebration'
  },
  {
    id: 'Surat Keterangan Kehilangan',
    label: 'Surat Keterangan Kehilangan',
    description: 'Pengantar kehilangan dokumen penting (seperti KTP, KK, Akta Kelahiran) sebagai syarat pengurusan dokumen baru ke dinas terkait.',
    icon: 'find_in_page'
  },
  {
    id: 'Surat Keterangan Izin Muat Kayu',
    label: 'Surat Keterangan Izin Muat Kayu',
    description: 'Surat keterangan jalan/angkutan muatan kayu hasil perkebunan rakyat di wilayah desa sesuai dengan peraturan kehutanan yang berlaku.',
    icon: 'forest'
  }
];

export default function PermohonanSurat() {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nomor_hp: '',
    jenis_surat: SURAT_TYPES[0].id,
    keterangan: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedSurat = SURAT_TYPES.find(s => s.id === formData.jenis_surat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nama_lengkap.trim()) {
      setError('Nama Lengkap harus diisi.');
      return;
    }
    if (!formData.nomor_hp.trim()) {
      setError('Nomor HP/WhatsApp harus diisi.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.desadumbayabulan.my.id/api/v1/layanan/permohonan-surat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nama_lengkap: '',
          nomor_hp: '',
          jenis_surat: SURAT_TYPES[0].id,
          keterangan: ''
        });
      } else {
        setError(data.message || 'Terjadi kesalahan saat mengirim permohonan.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4faf7] via-white to-[#e8f5ee] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Information Panel */}
        <div className="md:col-span-5 space-y-6 text-on-surface">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Layanan Mandiri Desa
            </span>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight leading-none">
              Permohonan Surat Online
            </h1>
            <p className="mt-3 text-on-surface-variant text-sm leading-relaxed">
              Masyarakat Desa Dumbayabulan kini dapat mengajukan permohonan berbagai jenis surat administrasi secara langsung tanpa harus datang berulang kali.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 items-start bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-outline-variant shadow-xs">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-container rounded-xl">
                security
              </span>
              <div>
                <h4 className="font-bold text-sm">Keamanan Data</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Tidak memerlukan NIK atau login password. Cukup Nama dan Nomor WhatsApp aktif.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-outline-variant shadow-xs">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-container rounded-xl">
                chat
              </span>
              <div>
                <h4 className="font-bold text-sm">Notifikasi WhatsApp</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Admin desa akan menerima permohonan via WA secara instan. Ketika surat selesai, Anda juga akan langsung dikabari via WhatsApp.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-outline-variant shadow-xs">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-container rounded-xl">
                history_edu
              </span>
              <div>
                <h4 className="font-bold text-sm">Proses Cepat</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Surat divalidasi dan dibuat manual oleh administrator desa, kemudian Anda tinggal menjemput berkas fisik.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-7 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden">

          {/* Success screen */}
          {success ? (
            <div className="text-center py-10 space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-5xl">task_alt</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-primary">Permohonan Terkirim!</h2>
                <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                  Permohonan surat Anda berhasil diajukan dan sedang diteruskan ke Admin Desa.
                </p>
              </div>
              <div className="bg-primary/5 rounded-2xl p-4 text-xs text-left text-primary-dark max-w-md mx-auto space-y-1">
                <p className="font-bold">Langkah Selanjutnya:</p>
                <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                  <li>Admin Desa akan meninjau dan membuat draf surat secara fisik.</li>
                  <li>Anda akan menerima pesan konfirmasi WhatsApp otomatis dari sistem jika surat Anda sudah <strong>Selesai</strong>.</li>
                  <li>Silakan ambil surat fisik ke Kantor Desa dengan menyebutkan Nama Lengkap Anda.</li>
                </ul>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer text-sm"
              >
                Buat Permohonan Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h2 className="text-xl font-black text-primary">Formulir Permohonan</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Silakan isi formulir di bawah ini dengan data asli.</p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-error-container text-error text-xs font-bold flex items-center gap-2 animate-bounce">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Jenis Surat Selector */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Pilih Jenis Surat</label>
                  <select
                    value={formData.jenis_surat}
                    onChange={(e) => setFormData({ ...formData, jenis_surat: e.target.value })}
                    className="w-full p-3.5 bg-surface rounded-xl border border-outline-variant text-sm font-semibold focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                  >
                    {SURAT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Description Box */}
                {selectedSurat && (
                  <div className="p-4 bg-primary-container/20 rounded-2xl border border-primary/10 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">{selectedSurat.icon}</span>
                    <div className="text-xs">
                      <p className="font-bold text-primary">{selectedSurat.label}</p>
                      <p className="text-on-surface-variant mt-1 leading-relaxed">{selectedSurat.description}</p>
                    </div>
                  </div>
                )}

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda sesuai KTP..."
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                    className="w-full p-3.5 bg-surface rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline"
                  />
                </div>

                {/* Nomor HP */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Nomor HP / WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.nomor_hp}
                    onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                    className="w-full p-3.5 bg-surface rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1 ml-1">Pastikan nomor aktif agar dapat menerima pesan WhatsApp otomatis saat surat selesai.</p>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Keterangan Tambahan / Keperluan (Opsional)</label>
                  <textarea
                    rows="3"
                    placeholder="Tuliskan keterangan pendukung, misalnya: bidang usaha jualan sembako (untuk SKU), keperluan beasiswa anak (untuk SKTM), tanggal acara (untuk Izin Keramaian)..."
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full p-3.5 bg-surface rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
                    Kirim Permohonan
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
