import { useState, useEffect } from 'react';

export default function KelolaIdmForm({ token }) {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Tab 1: Ringkasan States
  const [summaries, setSummaries] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [editingSummaryId, setEditingSummaryId] = useState(null);
  const [summaryData, setSummaryData] = useState({
    tahun: new Date().getFullYear(),
    skor_idm: '',
    status: 'BERKEMBANG',
    target_status: 'MAJU',
    skor_minimal: '',
    penambahan: '',
    skor_iks: '',
    skor_ike: '',
    skor_ikl: ''
  });

  // Tab 2: Indikator States
  const [indicators, setIndicators] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [editingIndicatorId, setEditingIndicatorId] = useState(null);
  const [indicatorData, setIndicatorData] = useState({
    grup: 'IKS',
    tahun: 2024,
    indikator: '',
    skor: 0,
    keterangan: '',
    kegiatan: '',
    nilai_plus: '0.0000',
    pusat: '',
    provinsi: '',
    kabupaten: '',
    desa: '',
    csr: '',
    lainnya: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedYear]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resSummary = await fetch('http://localhost:8000/api/v1/admin/idm', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      
      if (resSummary.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }
      
      if (!resSummary.ok) throw new Error('Gagal mengambil data ringkasan IDM');
      const dataSummary = await resSummary.json();
      setSummaries(dataSummary);

      const resIndicators = await fetch(`http://localhost:8000/api/v1/admin/idm-indicators?tahun=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      
      if (resIndicators.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }
      
      if (!resIndicators.ok) throw new Error('Gagal mengambil data indikator IDM');
      const dataIndicators = await resIndicators.json();
      setIndicators(dataIndicators);
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
        setError('Gagal menghubungkan ke server backend (port 8000). Pastikan server backend Laravel Anda sedang berjalan.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Summary Methods ---
  const openSummaryModal = (summary = null) => {
    if (summary) {
      setEditingSummaryId(summary.id);
      setSummaryData({
        tahun: summary.tahun,
        skor_idm: summary.skor_idm,
        status: summary.status,
        target_status: summary.target_status,
        skor_minimal: summary.skor_minimal,
        penambahan: summary.penambahan,
        skor_iks: summary.skor_iks,
        skor_ike: summary.skor_ike,
        skor_ikl: summary.skor_ikl
      });
    } else {
      setEditingSummaryId(null);
      setSummaryData({
        tahun: new Date().getFullYear(),
        skor_idm: '',
        status: 'BERKEMBANG',
        target_status: 'MAJU',
        skor_minimal: '',
        penambahan: '',
        skor_iks: '',
        skor_ike: '',
        skor_ikl: ''
      });
    }
    setError(null);
    setShowSummaryModal(true);
  };

  const handleSummarySubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const url = editingSummaryId 
      ? `http://localhost:8000/api/v1/admin/idm/${editingSummaryId}`
      : 'http://localhost:8000/api/v1/admin/idm';
    const method = editingSummaryId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(summaryData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
      setShowSummaryModal(false);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummaryDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data IDM tahun ini?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/idm/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Gagal menghapus data');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Indicator Methods ---
  const openIndicatorModal = (indicator = null) => {
    if (indicator) {
      setEditingIndicatorId(indicator.id);
      setIndicatorData({
        grup: indicator.grup || 'IKS',
        tahun: indicator.tahun || selectedYear,
        indikator: indicator.indikator,
        skor: indicator.skor,
        keterangan: indicator.keterangan || '',
        kegiatan: indicator.kegiatan || '',
        nilai_plus: indicator.nilai_plus,
        pusat: indicator.pusat || '',
        provinsi: indicator.provinsi || '',
        kabupaten: indicator.kabupaten || '',
        desa: indicator.desa || '',
        csr: indicator.csr || '',
        lainnya: indicator.lainnya || ''
      });
    } else {
      setEditingIndicatorId(null);
      setIndicatorData({
        grup: 'IKS',
        tahun: selectedYear,
        indikator: '',
        skor: 0,
        keterangan: '',
        kegiatan: '',
        nilai_plus: '0.0000',
        pusat: '',
        provinsi: '',
        kabupaten: '',
        desa: '',
        csr: '',
        lainnya: ''
      });
    }
    setError(null);
    setShowIndicatorModal(true);
  };

  const handleIndicatorSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const url = editingIndicatorId 
      ? `http://localhost:8000/api/v1/admin/idm-indicators/${editingIndicatorId}`
      : 'http://localhost:8000/api/v1/admin/idm-indicators';
    const method = editingIndicatorId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(indicatorData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
      setShowIndicatorModal(false);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleIndicatorDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus indikator IDM ini?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/idm-indicators/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Gagal menghapus data');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const activeSummary = summaries.find(item => String(item.tahun) === selectedYear) || (summaries.length > 0 ? summaries[summaries.length - 1] : null);
  const iksIndicators = indicators.filter(item => item.grup === 'IKS');
  const ikeIndicators = indicators.filter(item => item.grup === 'IKE');
  const iklIndicators = indicators.filter(item => item.grup === 'IKL');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header and Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kelola Indeks Desa Membangun (IDM)</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola data ringkasan skor dan rincian indikator IDM desa.</p>
        </div>
        <div className="flex gap-2 bg-surface-container rounded-xl p-1 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('ringkasan')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'ringkasan' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Ringkasan IDM
          </button>
          <button 
            onClick={() => setActiveTab('indikator')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'indikator' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Indikator IDM
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="bg-error-container text-on-error-container text-sm p-4 rounded-2xl font-medium border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-on-surface-variant animate-pulse font-bold">Memuat data...</div>
      ) : activeTab === 'ringkasan' ? (
        // Ringkasan IDM Table View
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => openSummaryModal()}
              className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah Data Tahun
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-primary">
                    <th className="p-4 font-bold text-sm">Tahun</th>
                    <th className="p-4 font-bold text-sm">Skor IDM</th>
                    <th className="p-4 font-bold text-sm">Status</th>
                    <th className="p-4 font-bold text-sm">Target</th>
                    <th className="p-4 font-bold text-sm">IKS</th>
                    <th className="p-4 font-bold text-sm">IKE</th>
                    <th className="p-4 font-bold text-sm">IKL</th>
                    <th className="p-4 font-bold text-sm w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-on-surface-variant">Belum ada data IDM.</td>
                    </tr>
                  ) : (
                    summaries.map(item => (
                      <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4 font-bold text-on-surface">{item.tahun}</td>
                        <td className="p-4 text-on-surface">{item.skor_idm}</td>
                        <td className="p-4"><span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold">{item.status}</span></td>
                        <td className="p-4"><span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">{item.target_status}</span></td>
                        <td className="p-4 text-on-surface-variant">{item.skor_iks}</td>
                        <td className="p-4 text-on-surface-variant">{item.skor_ike}</td>
                        <td className="p-4 text-on-surface-variant">{item.skor_ikl}</td>
                        <td className="p-4 flex gap-2">
                          <button onClick={() => openSummaryModal(item)} className="p-2 bg-surface-container hover:bg-primary-container hover:text-primary rounded-lg transition-colors cursor-pointer" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleSummaryDelete(item.id)} className="p-2 bg-surface-container hover:bg-error-container hover:text-error rounded-lg transition-colors cursor-pointer" title="Hapus">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Indikator IDM Table View
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface-variant">Filter Tahun Indikator:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-outline-variant px-3 py-1.5 rounded-xl text-sm font-bold text-primary focus:outline-none cursor-pointer"
              >
                {summaries.length > 0 ? (
                  summaries.map(item => (
                    <option key={item.tahun} value={item.tahun}>{item.tahun}</option>
                  ))
                ) : (
                  [2022, 2023, 2024].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))
                )}
              </select>
            </div>
            <button
              onClick={() => openIndicatorModal()}
              className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah Indikator
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-primary">
                    <th className="p-3 font-bold text-center">No</th>
                    <th className="p-3 font-bold text-center">Grup</th>
                    <th className="p-3 font-bold">Indikator</th>
                    <th className="p-3 font-bold text-center">Skor</th>
                    <th className="p-3 font-bold">Keterangan</th>
                    <th className="p-3 font-bold">Kegiatan</th>
                    <th className="p-3 font-bold text-center">Nilai+</th>
                    <th className="p-3 font-bold">Pusat</th>
                    <th className="p-3 font-bold">Prov.</th>
                    <th className="p-3 font-bold">Kab.</th>
                    <th className="p-3 font-bold">Desa</th>
                    <th className="p-3 font-bold">CSR</th>
                    <th className="p-3 font-bold">Lainnya</th>
                    <th className="p-3 font-bold text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.length === 0 ? (
                    <tr>
                      <td colSpan="14" className="p-8 text-center text-on-surface-variant">Belum ada data indikator IDM.</td>
                    </tr>
                  ) : (
                    <>
                      {/* IKS (Indeks Ketahanan Sosial) */}
                      {iksIndicators.length > 0 && (
                        <>
                          <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                            <td colSpan="5" className="p-3 text-[12px] uppercase tracking-wider">IKS (Indeks Ketahanan Sosial)</td>
                            <td colSpan="9" className="p-3 text-[12px] text-right font-black">SKOR IKS {activeSummary?.tahun || '2024'}: {activeSummary?.skor_iks || '0.0000'}</td>
                          </tr>
                          {iksIndicators.map((item, index) => (
                            <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                              <td className="p-3 text-center font-bold text-on-surface">{index + 1}</td>
                              <td className="p-3 text-center font-bold"><span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-bold text-[10px]">{item.grup}</span></td>
                              <td className="p-3 font-bold text-on-surface">{item.indikator}</td>
                              <td className="p-3 text-center font-bold text-primary">{item.skor}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.keterangan}>{item.keterangan}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.kegiatan}>{item.kegiatan || '-'}</td>
                              <td className="p-3 text-center font-semibold text-secondary">{item.nilai_plus}</td>
                              <td className="p-3 text-on-surface-variant">{item.pusat || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.provinsi || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.kabupaten || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.desa || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.csr || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.lainnya || '-'}</td>
                              <td className="p-3 flex gap-2 justify-center">
                                <button onClick={() => openIndicatorModal(item)} className="p-1.5 bg-surface-container hover:bg-primary-container hover:text-primary rounded-lg transition-colors cursor-pointer" title="Edit">
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button onClick={() => handleIndicatorDelete(item.id)} className="p-1.5 bg-surface-container hover:bg-error-container hover:text-error rounded-lg transition-colors cursor-pointer" title="Hapus">
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}

                      {/* IKE (Indeks Ketahanan Ekonomi) */}
                      {ikeIndicators.length > 0 && (
                        <>
                          <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                            <td colSpan="5" className="p-3 text-[12px] uppercase tracking-wider border-t border-outline-variant/30">IKE (Indeks Ketahanan Ekonomi)</td>
                            <td colSpan="9" className="p-3 text-[12px] text-right font-black border-t border-outline-variant/30">SKOR IKE {activeSummary?.tahun || '2024'}: {activeSummary?.skor_ike || '0.0000'}</td>
                          </tr>
                          {ikeIndicators.map((item, index) => (
                            <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                              <td className="p-3 text-center font-bold text-on-surface">{index + 1}</td>
                              <td className="p-3 text-center font-bold"><span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-bold text-[10px]">{item.grup}</span></td>
                              <td className="p-3 font-bold text-on-surface">{item.indikator}</td>
                              <td className="p-3 text-center font-bold text-primary">{item.skor}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.keterangan}>{item.keterangan}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.kegiatan}>{item.kegiatan || '-'}</td>
                              <td className="p-3 text-center font-semibold text-secondary">{item.nilai_plus}</td>
                              <td className="p-3 text-on-surface-variant">{item.pusat || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.provinsi || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.kabupaten || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.desa || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.csr || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.lainnya || '-'}</td>
                              <td className="p-3 flex gap-2 justify-center">
                                <button onClick={() => openIndicatorModal(item)} className="p-1.5 bg-surface-container hover:bg-primary-container hover:text-primary rounded-lg transition-colors cursor-pointer" title="Edit">
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button onClick={() => handleIndicatorDelete(item.id)} className="p-1.5 bg-surface-container hover:bg-error-container hover:text-error rounded-lg transition-colors cursor-pointer" title="Hapus">
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}

                      {/* IKL (Indeks Ketahanan Ekologi/Lingkungan) */}
                      {iklIndicators.length > 0 && (
                        <>
                          <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                            <td colSpan="5" className="p-3 text-[12px] uppercase tracking-wider border-t border-outline-variant/30">IKL (Indeks Ketahanan Ekologi/Lingkungan)</td>
                            <td colSpan="9" className="p-3 text-[12px] text-right font-black border-t border-outline-variant/30">SKOR IKL {activeSummary?.tahun || '2024'}: {activeSummary?.skor_ikl || '0.0000'}</td>
                          </tr>
                          {iklIndicators.map((item, index) => (
                            <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                              <td className="p-3 text-center font-bold text-on-surface">{index + 1}</td>
                              <td className="p-3 text-center font-bold"><span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-bold text-[10px]">{item.grup}</span></td>
                              <td className="p-3 font-bold text-on-surface">{item.indikator}</td>
                              <td className="p-3 text-center font-bold text-primary">{item.skor}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.keterangan}>{item.keterangan}</td>
                              <td className="p-3 text-on-surface-variant max-w-[150px] truncate" title={item.kegiatan}>{item.kegiatan || '-'}</td>
                              <td className="p-3 text-center font-semibold text-secondary">{item.nilai_plus}</td>
                              <td className="p-3 text-on-surface-variant">{item.pusat || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.provinsi || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.kabupaten || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.desa || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.csr || '-'}</td>
                              <td className="p-3 text-on-surface-variant">{item.lainnya || '-'}</td>
                              <td className="p-3 flex gap-2 justify-center">
                                <button onClick={() => openIndicatorModal(item)} className="p-1.5 bg-surface-container hover:bg-primary-container hover:text-primary rounded-lg transition-colors cursor-pointer" title="Edit">
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button onClick={() => handleIndicatorDelete(item.id)} className="p-1.5 bg-surface-container hover:bg-error-container hover:text-error rounded-lg transition-colors cursor-pointer" title="Hapus">
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Summary Modal --- */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-bold text-xl text-primary">{editingSummaryId ? 'Edit Data IDM' : 'Tambah Data IDM'}</h3>
              <button onClick={() => setShowSummaryModal(false)} className="text-on-surface-variant hover:text-error transition-colors rounded-full p-1 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSummarySubmit} className="p-6 overflow-y-auto space-y-6">
              {error && <div className="bg-error-container text-on-error-container text-sm p-4 rounded-xl font-medium">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2">Tahun</label>
                  <input type="number" value={summaryData.tahun} onChange={e => setSummaryData({...summaryData, tahun: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Skor IDM</label>
                  <input type="number" step="0.0001" value={summaryData.skor_idm} onChange={e => setSummaryData({...summaryData, skor_idm: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Status Saat Ini</label>
                  <select value={summaryData.status} onChange={e => setSummaryData({...summaryData, status: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none">
                    <option value="SANGAT TERTINGGAL">SANGAT TERTINGGAL</option>
                    <option value="TERTINGGAL">TERTINGGAL</option>
                    <option value="BERKEMBANG">BERKEMBANG</option>
                    <option value="MAJU">MAJU</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Target Status</label>
                  <select value={summaryData.target_status} onChange={e => setSummaryData({...summaryData, target_status: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none">
                    <option value="SANGAT TERTINGGAL">SANGAT TERTINGGAL</option>
                    <option value="TERTINGGAL">TERTINGGAL</option>
                    <option value="BERKEMBANG">BERKEMBANG</option>
                    <option value="MAJU">MAJU</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Skor Minimal (Target)</label>
                  <input type="number" step="0.0001" value={summaryData.skor_minimal} onChange={e => setSummaryData({...summaryData, skor_minimal: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Penambahan (Kekurangan)</label>
                  <input type="number" step="0.0001" value={summaryData.penambahan} onChange={e => setSummaryData({...summaryData, penambahan: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30">
                <h4 className="font-bold text-primary mb-4">Indeks Komposit</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2">Skor IKS</label>
                    <input type="number" step="0.0001" value={summaryData.skor_iks} onChange={e => setSummaryData({...summaryData, skor_iks: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Skor IKE</label>
                    <input type="number" step="0.0001" value={summaryData.skor_ike} onChange={e => setSummaryData({...summaryData, skor_ike: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Skor IKL</label>
                    <input type="number" step="0.0001" value={summaryData.skor_ikl} onChange={e => setSummaryData({...summaryData, skor_ikl: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30">
                <button type="button" onClick={() => setShowSummaryModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-container hover:text-on-primary-container flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
                  {isSaving ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Menyimpan...</> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Indicator Modal --- */}
      {showIndicatorModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-bold text-xl text-primary">{editingIndicatorId ? 'Edit Indikator IDM' : 'Tambah Indikator IDM'}</h3>
              <button onClick={() => setShowIndicatorModal(false)} className="text-on-surface-variant hover:text-error transition-colors rounded-full p-1 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleIndicatorSubmit} className="p-6 overflow-y-auto space-y-6">
              {error && <div className="bg-error-container text-on-error-container text-sm p-4 rounded-xl font-medium">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2">Grup Indikator</label>
                  <select value={indicatorData.grup} onChange={e => setIndicatorData({...indicatorData, grup: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none">
                    <option value="IKS">IKS (Ketahanan Sosial)</option>
                    <option value="IKE">IKE (Ketahanan Ekonomi)</option>
                    <option value="IKL">IKL (Ketahanan Ekologi/Lingkungan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tahun</label>
                  <input
                    type="number"
                    value={indicatorData.tahun}
                    onChange={e => setIndicatorData({...indicatorData, tahun: parseInt(e.target.value) || ''})}
                    required
                    className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold mb-2">Nama Indikator</label>
                  <input type="text" value={indicatorData.indikator} onChange={e => setIndicatorData({...indicatorData, indikator: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Contoh: Skor Akses Sarkes" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Skor (0-5)</label>
                  <input type="number" min="0" max="5" value={indicatorData.skor} onChange={e => setIndicatorData({...indicatorData, skor: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Nilai +</label>
                  <input type="number" step="0.0001" value={indicatorData.nilai_plus} onChange={e => setIndicatorData({...indicatorData, nilai_plus: e.target.value})} required className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold mb-2">Keterangan</label>
                  <textarea rows="2" value={indicatorData.keterangan} onChange={e => setIndicatorData({...indicatorData, keterangan: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Masukkan detail keterangan..."></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold mb-2">Kegiatan yang Dapat Dilakukan</label>
                  <textarea rows="2" value={indicatorData.kegiatan} onChange={e => setIndicatorData({...indicatorData, kegiatan: e.target.value})} className="w-full p-3 rounded-xl border border-outline-variant focus:border-primary outline-none" placeholder="Masukkan rencana kegiatan..."></textarea>
                </div>
              </div>

              {/* Pelaksana Kegiatan */}
              <div className="pt-4 border-t border-outline-variant/30">
                <h4 className="font-bold text-primary mb-4">Yang Dapat Melaksanakan Kegiatan</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Pusat</label>
                    <input type="text" value={indicatorData.pusat} onChange={e => setIndicatorData({...indicatorData, pusat: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Provinsi</label>
                    <input type="text" value={indicatorData.provinsi} onChange={e => setIndicatorData({...indicatorData, provinsi: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Kabupaten</label>
                    <input type="text" value={indicatorData.kabupaten} onChange={e => setIndicatorData({...indicatorData, kabupaten: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Desa</label>
                    <input type="text" value={indicatorData.desa} onChange={e => setIndicatorData({...indicatorData, desa: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">CSR</label>
                    <input type="text" value={indicatorData.csr} onChange={e => setIndicatorData({...indicatorData, csr: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Lainnya</label>
                    <input type="text" value={indicatorData.lainnya} onChange={e => setIndicatorData({...indicatorData, lainnya: e.target.value})} className="w-full p-2.5 rounded-lg border border-outline-variant text-sm outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30">
                <button type="button" onClick={() => setShowIndicatorModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-container hover:text-on-primary-container flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
                  {isSaving ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Menyimpan...</> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
