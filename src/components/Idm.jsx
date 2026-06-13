import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Idm() {
  const [data, setData] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingIndicators, setLoadingIndicators] = useState(false);

  // Fetch summaries once on mount
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const idmRes = await fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/idm');
        const idmJson = await idmRes.json();

        if (Array.isArray(idmJson) && idmJson.length > 0) {
          const sorted = [...idmJson].sort((a, b) => a.tahun - b.tahun);
          setData(sorted);
          // Default to the latest year available
          const latestYear = sorted[sorted.length - 1].tahun;
          setSelectedYear(String(latestYear));
        }
      } catch (error) {
        console.error("Failed to fetch IDM summaries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummaries();
  }, []);

  // Fetch indicators when selectedYear changes
  useEffect(() => {
    if (!selectedYear) return;
    const fetchIndicatorsForYear = async () => {
      setLoadingIndicators(true);
      try {
        const indicatorRes = await fetch(`https://api.desadumbayabulan.my.id/api/v1/infografis/idm-indicators?tahun=${selectedYear}`);
        const indicatorJson = await indicatorRes.json();
        if (Array.isArray(indicatorJson)) {
          setIndicators(indicatorJson);
        }
      } catch (error) {
        console.error("Failed to fetch IDM indicators", error);
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchIndicatorsForYear();
  }, [selectedYear]);

  if (loading) {
    return <div className="p-12 text-center text-primary font-bold animate-pulse">Memuat Data IDM...</div>;
  }

  // Get active summary data based on selected year
  const activeData = data.find(row => String(row.tahun) === selectedYear) || (data.length > 0 ? data[data.length - 1] : null);

  const iksIndicators = indicators.filter(row => row.grup === 'IKS');
  const ikeIndicators = indicators.filter(row => row.grup === 'IKE');
  const iklIndicators = indicators.filter(row => row.grup === 'IKL');

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      
      {/* Header and Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold text-primary">IDM</h1>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-sm">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none text-sm font-extrabold text-primary focus:outline-none cursor-pointer pr-1"
              >
                {data.map(item => (
                  <option key={item.tahun} value={item.tahun}>{item.tahun}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Indeks Desa Membangun (IDM) merupakan indeks komposit yang dibentuk dari tiga indeks, yaitu Indeks Ketahanan Sosial, Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
          </p>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <span className="text-sm font-bold text-outline uppercase tracking-wider">SKOR IDM {activeData?.tahun || '2024'}</span>
            <span className="text-4xl font-black text-on-surface">{activeData?.skor_idm || '0.0000'}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <span className="text-sm font-bold text-outline uppercase tracking-wider">STATUS IDM {activeData?.tahun || '2024'}</span>
            <span className="text-4xl font-black text-primary">{activeData?.status || 'BELUM ADA'}</span>
          </div>
        </div>
        
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
          <p className="text-xs font-bold text-outline mb-2">Target Status</p>
          <p className="text-xl font-bold text-on-surface">{activeData?.target_status || '-'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
          <p className="text-xs font-bold text-outline mb-2">Skor Minimal</p>
          <p className="text-xl font-bold text-on-surface">{activeData?.skor_minimal || '-'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
          <p className="text-xs font-bold text-outline mb-2">Penambahan</p>
          <p className="text-xl font-bold text-on-surface">{activeData?.penambahan || '-'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
          <p className="text-xs font-bold text-outline mb-2">Skor IKS</p>
          <p className="text-xl font-bold text-on-surface">{activeData?.skor_iks || '-'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
          <p className="text-xs font-bold text-outline mb-2">Skor IKE</p>
          <p className="text-xl font-bold text-on-surface">{activeData?.skor_ike || '-'}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
        <h3 className="text-2xl font-bold text-primary mb-8">Skor IDM tahun ke tahun</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="tahun" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis domain={[0, 1]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line 
                type="monotone" 
                dataKey="skor_idm" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Huge Table Area */}
      <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary text-on-primary">
                <th className="p-3 border-r border-white/10 w-10 text-center">No</th>
                <th className="p-3 border-r border-white/10">Indikator IDM</th>
                <th className="p-3 border-r border-white/10 text-center">Skor</th>
                <th className="p-3 border-r border-white/10">Keterangan</th>
                <th className="p-3 border-r border-white/10">Kegiatan yang dapat dilakukan</th>
                <th className="p-3 border-r border-white/10 text-center">Nilai+</th>
                <th colSpan="6" className="p-3 text-center border-b border-white/10">Yang dapat melaksanakan kegiatan</th>
              </tr>
              <tr className="bg-primary/90 text-on-primary">
                <th colSpan="6" className="border-r border-white/10"></th>
                <th className="p-2 border-r border-white/10 text-center">Pusat</th>
                <th className="p-2 border-r border-white/10 text-center">Provinsi</th>
                <th className="p-2 border-r border-white/10 text-center">Kab.</th>
                <th className="p-2 border-r border-white/10 text-center">Desa</th>
                <th className="p-2 border-r border-white/10 text-center">CSR</th>
                <th className="p-2 text-center">Lainnya</th>
              </tr>
            </thead>
            <tbody className="text-on-surface relative">
              {loadingIndicators && (
                <tr className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <td>
                    <span className="text-xs font-bold text-primary animate-pulse">Memuat indikator tahun {selectedYear}...</span>
                  </td>
                </tr>
              )}
              {indicators.length === 0 ? (
                <tr>
                  <td colSpan="12" className="p-8 text-center text-on-surface-variant font-medium">Belum ada data indikator IDM.</td>
                </tr>
              ) : (
                <>
                  {/* IKS (Indeks Ketahanan Sosial) */}
                  {iksIndicators.length > 0 && (
                    <>
                      <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                        <td colSpan="5" className="p-3 text-[13px] uppercase tracking-wider">IKS (Indeks Ketahanan Sosial)</td>
                        <td colSpan="7" className="p-3 text-[13px] text-right">SKOR IKS {activeData?.tahun || '2024'}: {activeData?.skor_iks || '0.0000'}</td>
                      </tr>
                      {iksIndicators.map((row, index) => (
                        <tr key={row.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold">{index + 1}</td>
                          <td className="p-3 border-r border-outline-variant/20 font-medium">{row.indikator}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-primary">{row.skor}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.keterangan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.kegiatan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-secondary">{row.nilai_plus}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.pusat || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.provinsi || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.kabupaten || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-medium">{row.desa || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.csr || '-'}</td>
                          <td className="p-3 text-center">{row.lainnya || '-'}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* IKE (Indeks Ketahanan Ekonomi) */}
                  {ikeIndicators.length > 0 && (
                    <>
                      <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                        <td colSpan="5" className="p-3 text-[13px] uppercase tracking-wider border-t border-outline-variant/30">IKE (Indeks Ketahanan Ekonomi)</td>
                        <td colSpan="7" className="p-3 text-[13px] text-right border-t border-outline-variant/30">SKOR IKE {activeData?.tahun || '2024'}: {activeData?.skor_ike || '0.0000'}</td>
                      </tr>
                      {ikeIndicators.map((row, index) => (
                        <tr key={row.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold">{index + 1}</td>
                          <td className="p-3 border-r border-outline-variant/20 font-medium">{row.indikator}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-primary">{row.skor}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.keterangan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.kegiatan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-secondary">{row.nilai_plus}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.pusat || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.provinsi || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.kabupaten || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-medium">{row.desa || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.csr || '-'}</td>
                          <td className="p-3 text-center">{row.lainnya || '-'}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* IKL (Indeks Ketahanan Ekologi/Lingkungan) */}
                  {iklIndicators.length > 0 && (
                    <>
                      <tr className="bg-primary/5 font-extrabold text-primary border-b border-outline-variant/20">
                        <td colSpan="5" className="p-3 text-[13px] uppercase tracking-wider border-t border-outline-variant/30">IKL (Indeks Ketahanan Ekologi/Lingkungan)</td>
                        <td colSpan="7" className="p-3 text-[13px] text-right border-t border-outline-variant/30">SKOR IKL {activeData?.tahun || '2024'}: {activeData?.skor_ikl || '0.0000'}</td>
                      </tr>
                      {iklIndicators.map((row, index) => (
                        <tr key={row.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold">{index + 1}</td>
                          <td className="p-3 border-r border-outline-variant/20 font-medium">{row.indikator}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-primary">{row.skor}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.keterangan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20">{row.kegiatan || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-bold text-secondary">{row.nilai_plus}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.pusat || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.provinsi || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.kabupaten || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center font-medium">{row.desa || '-'}</td>
                          <td className="p-3 border-r border-outline-variant/20 text-center">{row.csr || '-'}</td>
                          <td className="p-3 text-center">{row.lainnya || '-'}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </>
              )}
              
              {/* Summary Row */}
              <tr className="bg-primary/10 font-bold border-t-2 border-primary/20">
                <td colSpan="5" className="p-4 text-right text-primary uppercase tracking-wider">SKOR STATUS IDM {activeData?.tahun || '2024'}</td>
                <td colSpan="7" className="p-4 text-primary text-lg">{activeData?.status || 'BELUM ADA'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
