import { useState, useEffect } from 'react';

export default function FloatingStats() {
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/visitor/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Gagal mengambil data statistik kunjungan', e);
    }
  };

  if (!stats) return null;

  // Format numbers with dot separators
  const formatNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-2 select-none font-sans">
      {/* Detail Counter Card (Expanded State) */}
      {isExpanded && (
        <div className="bg-[#4e5960] text-white p-6 rounded-2xl shadow-2xl w-72 border border-white/10 animate-fade-in transition-all duration-300">
          <h3 className="font-bold text-lg mb-4 tracking-wide border-b border-white/10 pb-2">
            Jumlah Kunjungan
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Hari Ini</span>
              <span className="font-bold text-base">{formatNum(stats.hari_ini)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Kemarin</span>
              <span className="font-bold text-base">{formatNum(stats.kemarin)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Minggu Ini</span>
              <span className="font-bold text-base">{formatNum(stats.minggu_ini)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Minggu Lalu</span>
              <span className="font-bold text-base">{formatNum(stats.minggu_lalu)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Bulan Ini</span>
              <span className="font-bold text-base">{formatNum(stats.bulan_ini)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="opacity-80">Bulan Lalu</span>
              <span className="font-bold text-base">{formatNum(stats.bulan_lalu)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-teal-300">Total Kunjungan</span>
              <span className="font-extrabold text-lg text-teal-300">{formatNum(stats.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill (Always Visible) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-4 transition-all duration-300 cursor-pointer border border-teal-400/20 active:scale-95"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl">door_open</span>
          <div className="text-left leading-none">
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-100 block mb-0.5">
              Kunjungan
            </span>
            <span className="font-black text-base">
              {formatNum(stats.hari_ini)} <span className="text-xs font-normal opacity-90">Hari Ini</span>
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-xl transition-transform duration-300">
          {isExpanded ? 'expand_more' : 'expand_less'}
        </span>
      </button>
    </div>
  );
}
