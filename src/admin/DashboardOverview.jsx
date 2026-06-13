import { useState, useEffect } from 'react';

export default function DashboardOverview({ token, setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPenduduk: 0,
    laki: 0,
    perempuan: 0,
    dusun: [],
    skorIdm: '0.0000',
    statusIdm: '-',
    targetIdm: '-',
    apbdesPagu: 0,
    apbdesRealisasi: 0,
    totalBerita: 0,
    recentNews: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Demografi
        const resDemografi = await fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/demografi');
        const dataDemografi = await resDemografi.json();

        // Fetch APBDes for 2024
        const resApbdes = await fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/apbdes?tahun=2024');
        const dataApbdes = await resApbdes.json();

        // Fetch IDM
        const resIdm = await fetch('https://api.desadumbayabulan.my.id/api/v1/infografis/idm');
        const dataIdm = await resIdm.json();
        const latestIdm = dataIdm.length > 0 ? dataIdm[0] : null;

        // Fetch Berita
        const resBerita = await fetch('https://api.desadumbayabulan.my.id/api/v1/berita');
        const dataBerita = await resBerita.json();

        setStats({
          totalPenduduk: dataDemografi.summary?.total || 0,
          laki: dataDemografi.summary?.laki || 0,
          perempuan: dataDemografi.summary?.perempuan || 0,
          dusun: dataDemografi.dusun || [],
          skorIdm: latestIdm ? latestIdm.skor_idm : '0.7684',
          statusIdm: latestIdm ? latestIdm.status : 'MAJU',
          targetIdm: latestIdm ? latestIdm.target_status : 'MANDIRI',
          apbdesPagu: dataApbdes ? parseFloat(dataApbdes.belanja_pagu) : 0,
          apbdesRealisasi: dataApbdes ? parseFloat(dataApbdes.belanja_realisasi) : 0,
          totalBerita: dataBerita.length || 0,
          recentNews: dataBerita.slice(0, 3)
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-on-surface-variant font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  const quickActions = [
    { label: 'Profil Desa', tab: 'profil', icon: 'account_balance', color: 'from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-500/20' },
    { label: 'Peta Wilayah', tab: 'peta', icon: 'map', color: 'from-emerald-500/10 to-emerald-600/10 text-emerald-600 border-emerald-500/20' },
    { label: 'Kelola Penduduk', tab: 'kelola-warga', icon: 'groups', color: 'from-violet-500/10 to-violet-600/10 text-violet-600 border-violet-500/20' },
    { label: 'Kelola APBDes', tab: 'kelola-apbdes', icon: 'account_balance_wallet', color: 'from-pink-500/10 to-pink-600/10 text-pink-600 border-pink-500/20' },
    { label: 'Kelola IDM', tab: 'idm', icon: 'bar_chart', color: 'from-indigo-500/10 to-indigo-600/10 text-indigo-600 border-indigo-500/20' },
    { label: 'Tulis Berita', tab: 'berita', icon: 'newspaper', color: 'from-amber-500/10 to-amber-600/10 text-amber-600 border-amber-500/20' },
  ];

  const apbdesPercentage = stats.apbdesPagu > 0 ? (stats.apbdesRealisasi / stats.apbdesPagu) * 100 : 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary-container text-white p-6 md:p-8 rounded-3xl shadow-lg">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute left-1/3 bottom-0 translate-y-12 w-48 h-48 bg-secondary/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{getGreeting()}, Admin Desa!</h1>
            <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl font-medium">
              Selamat datang di portal administrasi Desa Dumbayabulan. Kelola informasi kependudukan, transparansi anggaran, status pembangunan, dan publikasi berita desa di satu tempat.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-sm font-bold flex items-center gap-2 self-stretch md:self-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Stat 1: Total Penduduk */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-5 hover:shadow-md transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Penduduk</p>
            <h3 className="text-2xl font-black text-on-surface mt-1">{stats.totalPenduduk.toLocaleString('id-ID')}</h3>
            <p className="text-[11px] text-on-surface-variant font-semibold mt-1 flex items-center gap-1">
              <span className="text-blue-600">{stats.laki} L</span> • <span className="text-pink-500">{stats.perempuan} P</span>
            </p>
          </div>
        </div>

        {/* Stat 2: IDM Score */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-5 hover:shadow-md transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[32px]">military_tech</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status IDM 2024</p>
            <h3 className="text-2xl font-black text-violet-600 mt-1">{stats.statusIdm}</h3>
            <p className="text-[11px] text-on-surface-variant font-semibold mt-1">
              Skor: <span className="font-bold text-on-surface">{stats.skorIdm}</span> (Target: {stats.targetIdm})
            </p>
          </div>
        </div>

        {/* Stat 3: APBDes Belanja */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-5 hover:shadow-md transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[32px]">payments</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Belanja APBDes 2024</p>
            <h3 className="text-lg font-black text-on-surface mt-1.5 truncate max-w-[150px]" title={formatCurrency(stats.apbdesPagu)}>
              {formatCurrency(stats.apbdesPagu)}
            </h3>
            <p className="text-[11px] text-on-surface-variant font-semibold mt-1">
              Realisasi: <span className="text-emerald-600 font-bold">{apbdesPercentage.toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Stat 4: Total Berita */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-5 hover:shadow-md transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[32px]">newspaper</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Artikel Berita</p>
            <h3 className="text-2xl font-black text-on-surface mt-1">{stats.totalBerita}</h3>
            <p className="text-[11px] text-on-surface-variant font-semibold mt-1">
              Telah terbit ke publik
            </p>
          </div>
        </div>

      </div>

      {/* Grid: Columns section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Quick Actions Shortcuts */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
              Pintas Tindakan Cepat
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map(action => (
                <button
                  key={action.tab}
                  onClick={() => setActiveTab(action.tab)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border bg-gradient-to-b ${action.color} hover:shadow-md hover:-translate-y-0.5 transition-all text-center group cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-3xl mb-2 transition-transform group-hover:scale-110">{action.icon}</span>
                  <span className="text-xs font-black text-on-surface-variant tracking-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Progress Card */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                Realisasi Belanja APBDes (Tahun Anggaran 2024)
              </h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs">TA 2024</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-on-surface-variant">Realisasi Penggunaan Dana</span>
                <span className="text-primary">{formatCurrency(stats.apbdesRealisasi)} / {formatCurrency(stats.apbdesPagu)}</span>
              </div>
              <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(apbdesPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
                <span>Pagu Anggaran Belanja</span>
                <span>Prosentase Realisasi: {apbdesPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Dusun distribution list */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
              Distribusi per Dusun
            </h3>
            <div className="divide-y divide-outline-variant/20">
              {stats.dusun.map(d => {
                const percent = stats.totalPenduduk > 0 ? (d.count / stats.totalPenduduk) * 100 : 0;
                return (
                  <div key={d.nama} className="py-3.5 first:pt-0 last:pb-0 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-on-surface text-sm">Dusun {d.nama}</p>
                      <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">{percent.toFixed(1)}% dari total penduduk</p>
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container-high rounded-lg text-xs font-black text-primary">
                      {d.count} Jiwa
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent News feed */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">list_alt</span>
                Berita Terbaru
              </h3>
              <button 
                onClick={() => setActiveTab('berita')}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentNews.length > 0 ? (
                stats.recentNews.map(item => (
                  <div key={item.id} className="group cursor-pointer border-b border-outline-variant/15 last:border-0 pb-3 last:pb-0" onClick={() => setActiveTab('berita')}>
                    <span className="text-[10px] text-secondary font-black tracking-wider uppercase">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <h4 className="font-bold text-sm text-on-surface mt-1 group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      {item.excerpt || (item.body ? JSON.parse(item.body).blocks?.[0]?.data?.text || '' : '')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-on-surface-variant text-xs font-medium">
                  Belum ada berita terbit.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
