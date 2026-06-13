import { useState, useEffect } from 'react';

export default function KelolaPermohonanSuratForm({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('https://api.desadumbayabulan.my.id/api/v1/admin/permohonan-surat', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
      setMessage('Gagal memuat riwayat permohonan.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSelesai = async (id) => {
    if (!window.confirm('Tandai permohonan ini sebagai selesai? Pesan WhatsApp otomatis akan langsung dikirim ke pemohon.')) {
      return;
    }

    try {
      const res = await fetch(`https://api.desadumbayabulan.my.id/api/v1/admin/permohonan-surat/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'selesai' })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Permohonan berhasil ditandai selesai dan WhatsApp pemberitahuan telah dikirim!');
        // Update local state
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'selesai' } : r));
      } else {
        setMessage(data.message || 'Gagal mengubah status permohonan.');
      }
    } catch (e) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data permohonan ini secara permanen?')) {
      return;
    }

    try {
      const res = await fetch(`https://api.desadumbayabulan.my.id/api/v1/admin/permohonan-surat/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        setMessage('Permohonan berhasil dihapus.');
        setRequests(requests.filter(r => r.id !== id));
      } else {
        setMessage('Gagal menghapus permohonan.');
      }
    } catch (e) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Helper format phone for wa link
  const getWhatsAppLink = (phone) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    return `https://wa.me/${cleanPhone}`;
  };

  // Helper format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Filtering logic
  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'semua' || r.status === filterStatus;
    const matchesSearch = 
      r.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jenis_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nomor_hp.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-bold">Memuat riwayat permohonan...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Permohonan Surat Masuk</h2>
          <p className="text-on-surface-variant text-sm mt-1">Daftar permohonan surat administrasi dari warga.</p>
        </div>
        
        {/* Statistics count */}
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="block text-xs font-bold text-amber-800 uppercase">Menunggu</span>
            <span className="text-lg font-black text-amber-900">{requests.filter(r => r.status === 'pending').length}</span>
          </div>
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="block text-xs font-bold text-emerald-800 uppercase">Selesai</span>
            <span className="text-lg font-black text-emerald-900">{requests.filter(r => r.status === 'selesai').length}</span>
          </div>
        </div>
      </div>

      {/* Message alert */}
      {message && (
        <div className="m-6 p-4 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold text-sm flex items-center gap-2 shadow-xs transition-all">
          <span className="material-symbols-outlined">info</span>
          {message}
        </div>
      )}

      {/* Filter and search bar */}
      <div className="p-6 border-b border-outline-variant bg-surface/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'semua'
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container'
            }`}
          >
            Semua ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container'
            }`}
          >
            Menunggu ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('selesai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'selesai'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container'
            }`}
          >
            Selesai ({requests.filter(r => r.status === 'selesai').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama, jenis surat, HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
          />
        </div>
      </div>

      {/* Request list */}
      <div className="overflow-x-auto">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">
              drafts
            </span>
            <p className="font-bold">Tidak ada data permohonan</p>
            <p className="text-xs">Data permohonan yang dicari tidak ditemukan.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase">
                <th className="p-4 pl-6">Tanggal Pengajuan</th>
                <th className="p-4">Pemohon</th>
                <th className="p-4">Jenis Surat</th>
                <th className="p-4">Keterangan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-surface/10 transition-colors text-sm">
                  <td className="p-4 pl-6 whitespace-nowrap text-xs text-on-surface-variant">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="p-4 font-bold text-primary">
                    <div>{req.nama_lengkap}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface-variant font-normal">
                      <span className="material-symbols-outlined text-sm">phone</span>
                      {req.nomor_hp}
                      <a
                        href={getWhatsAppLink(req.nomor_hp)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="Chat WhatsApp langsung"
                      >
                        <span className="material-symbols-outlined text-[10px]">chat</span>
                        Chat WA
                      </a>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-on-surface whitespace-nowrap">
                    {req.jenis_surat}
                  </td>
                  <td className="p-4 max-w-xs text-xs text-on-surface-variant leading-relaxed">
                    {req.keterangan || '-'}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {req.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                        Menunggu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Selesai
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right whitespace-nowrap">
                    <div className="inline-flex gap-2">
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleMarkSelesai(req.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-primary transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Tandai surat selesai dibuat & kirim WA"
                        >
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Selesai
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-1.5 rounded-xl text-error-container hover:bg-error-container hover:text-error transition-all cursor-pointer"
                        title="Hapus Permohonan"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
