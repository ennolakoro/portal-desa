import { useState, useEffect } from 'react';
import Idm from './Idm';

const getSubTabFromPath = (path) => {
  if (path === '/idm') return 'idm';
  const parts = path.split('/');
  if (parts.length > 2 && parts[1] === 'infografis') {
    const sub = parts[2];
    const validSubs = ['penduduk', 'apbdes', 'stunting', 'bansos', 'idm', 'sdgs'];
    if (validSubs.includes(sub)) return sub;
  }
  return 'penduduk';
};

export default function Infografis() {
  const [activeSubTab, setActiveSubTab] = useState(() => getSubTabFromPath(window.location.pathname));
  const [selectedYear, setSelectedYear] = useState('2024');
  const [stuntingYear, setStuntingYear] = useState('2024');
  const [namaSearch, setNamaSearch] = useState('');
  const [dusunSearch, setDusunSearch] = useState('1');
  const [searchResult, setSearchResult] = useState(null);

  const [demografiData, setDemografiData] = useState(null);
  const [apbdesData, setApbdesData] = useState(null);
  const [stuntingData, setStuntingData] = useState(null);
  const [allStuntingData, setAllStuntingData] = useState([]);
  const [bansosStats, setBansosStats] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setActiveSubTab(getSubTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchDemografi();
    fetchBansosStats();
  }, []);

  useEffect(() => {
    fetchStunting(stuntingYear);
    fetchAllStunting();
  }, [stuntingYear]);


  useEffect(() => {
    fetchApbdes();
  }, [selectedYear]);

  const handleSubTabChange = (tabId) => {
    window.history.pushState(null, '', `/infografis/${tabId}`);
    setActiveSubTab(tabId);
  };

  const fetchDemografi = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/infografis/demografi');
      const data = await res.json();
      if (res.ok) setDemografiData(data);
    } catch (e) {
      console.error('Gagal memuat data demografi', e);
    }
  };

  const fetchApbdes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/infografis/apbdes?tahun=${selectedYear}`);
      const data = await res.json();
      if (res.ok) setApbdesData(data);
    } catch (e) {
      console.error('Gagal memuat data APBDes', e);
    }
  };

  const fetchStunting = async (tahun = '2024') => {
    setStuntingData(null);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/infografis/stunting?tahun=${tahun}`);
      const data = await res.json();
      if (res.ok) setStuntingData(data);
    } catch (e) {
      console.error('Gagal memuat data stunting', e);
    }
  };

  const fetchAllStunting = async () => {
    try {
      // No tahun param → backend returns all records sorted by year
      const res = await fetch('http://localhost:8000/api/v1/infografis/stunting');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setAllStuntingData(data);
    } catch (e) {
      console.error('Gagal memuat semua data stunting', e);
    }
  };

  const fetchBansosStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/layanan/bansos-summary');
      const data = await res.json();
      if (res.ok) setBansosStats(data);
    } catch (e) {
      console.error('Gagal memuat data ringkasan bansos', e);
    }
  };

  const handleBansosCheck = async (e) => {
    e.preventDefault();
    if (namaSearch.trim().length < 3) {
      setSearchResult({
        found: false,
        message: 'Masukkan minimal 3 karakter nama lengkap warga untuk pengecekan.',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/layanan/cek-bansos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nama: namaSearch, dusun_id: parseInt(dusunSearch) })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setSearchResult({
        found: false,
        message: 'Koneksi ke server terputus.'
      });
    }
  };

  const subNavItems = [
    { id: 'penduduk', label: 'Penduduk', icon: 'groups' },
    { id: 'apbdes', label: 'APBDes', icon: 'account_balance_wallet' },
    { id: 'stunting', label: 'Stunting', icon: 'analytics' },
    { id: 'bansos', label: 'Bansos', icon: 'card_giftcard' },
    { id: 'idm', label: 'IDM', icon: 'verified' },
    { id: 'sdgs', label: 'SDGs', icon: 'format_list_numbered' },
  ];

  const getPiramidaWidth = (val, gender) => {
    if (!demografiData || !demografiData.piramida) {
      const fallbacks = {
        '0-5': { L: 92, P: 91 },
        '06-10': { L: 48, P: 48 },
        '11-15': { L: 58, P: 58 },
        '16-20': { L: 62, P: 62 },
        '21-25': { L: 62, P: 61 },
        '26-30': { L: 52, P: 52 },
        '31-35': { L: 30, P: 29 },
        '36-40': { L: 40, P: 39 },
        '41-45': { L: 38, P: 37 },
        '46-50': { L: 29, P: 29 },
        '51-55': { L: 36, P: 35 },
        '56-60': { L: 12, P: 11 },
        '61+': { L: 33, P: 32 },
      };
      return `${fallbacks[val]?.[gender] || 50}%`;
    }
    const row = demografiData.piramida.find(p => p.label === val);
    if (!row) return '10%';
    const maxVal = Math.max(...demografiData.piramida.map(p => Math.max(p.L, p.P)));
    const percent = maxVal > 0 ? (row[gender] / maxVal) * 95 : 10;
    return `${percent}%`;
  };

  const getPendidikanHeight = (label) => {
    if (!demografiData || !demografiData.pendidikan) {
      const fallbacks = { 'Tidak Sekolah': 40, 'SD': 25, 'SMP': 95, 'SMA': 20, 'Sarjana': 8 };
      return `${fallbacks[label] || 30}%`;
    }
    const item = demografiData.pendidikan.find(p => p.label === label);
    if (!item) return '10%';
    const maxVal = Math.max(...demografiData.pendidikan.map(p => p.value));
    const percent = maxVal > 0 ? (item.value / maxVal) * 95 : 10;
    return `${percent}%`;
  };
  
  const getPendidikanValue = (label) => {
    if (!demografiData || !demografiData.pendidikan) {
      const fallbacks = { 'Tidak Sekolah': 291, 'SD': 196, 'SMP': 651, 'SMA': 136, 'Sarjana': 19 };
      return fallbacks[label] || 0;
    }
    const item = demografiData.pendidikan.find(p => p.label === label);
    return item ? item.value : 0;
  };

  const getPekerjaanCount = (title) => {
    if (!demografiData || !demografiData.pekerjaan) {
      const fallbacks = {
        'Ibu Rumah Tangga': 360,
        'Belum/Tidak Bekerja': 343,
        'Pelajar/Mahasiswa': 300,
        'Nelayan/Perikanan': 191,
        'Petani/Pekebun': 190,
        'Buruh Harian Lepas': 11,
      };
      return fallbacks[title] || 0;
    }
    const item = demografiData.pekerjaan.find(p => p.title === title);
    return item ? item.count : 0;
  };
  
  const getPekerjaanWidth = (title) => {
    if (!demografiData || !demografiData.pekerjaan) {
      const fallbacks = {
        'Ibu Rumah Tangga': '65%',
        'Belum/Tidak Bekerja': '60%',
        'Pelajar/Mahasiswa': '55%',
        'Nelayan/Perikanan': '40%',
        'Petani/Pekebun': '38%',
        'Buruh Harian Lepas': '5%',
      };
      return fallbacks[title] || '10%';
    }
    const count = getPekerjaanCount(title);
    const maxVal = Math.max(...demografiData.pekerjaan.map(p => p.count));
    const percent = maxVal > 0 ? (count / maxVal) * 90 : 10;
    return `${percent}%`;
  };

  const getDusunConicGradient = () => {
    if (!demografiData || !demografiData.dusun) {
      return 'conic-gradient(#0d522c 0% 45.0%, #258a4f 45.0% 75.3%, #a9ddb9 75.3% 100%)';
    }
    const buwoto = demografiData.dusun.find(d => d.nama === 'Buwoto')?.count ?? 529;
    const dilipoga = demografiData.dusun.find(d => d.nama === 'Dilipoga')?.count ?? 357;
    const tapalu = demografiData.dusun.find(d => d.nama === 'Tapalu')?.count ?? 290;
    const total = buwoto + dilipoga + tapalu;
    if (total === 0) return '#0d522c';
    const p1 = ((buwoto / total) * 100).toFixed(1);
    const p2 = (((buwoto + dilipoga) / total) * 100).toFixed(1);
    return `conic-gradient(#0d522c 0% ${p1}%, #258a4f ${p1}% ${p2}%, #a9ddb9 ${p2}% 100%)`;
  };

  return (
    <div className="animate-fade-in max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12 space-y-12">
      {/* Dashboard Header & Sub-Navigation */}
      <section className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight uppercase">
            INFOGRAFIS
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary uppercase opacity-80">
            DESA DUMBAYA BULAN
          </h2>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {subNavItems.map((item) => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSubTabChange(item.id)}
                className={`flex flex-col items-center min-w-[100px] p-3 rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-md border-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/10 shadow-sm'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-2xl mb-1.5 ${isActive ? 'text-white' : 'text-primary'}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-bold tracking-wide uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Dynamic Panel */}
      {activeSubTab === 'penduduk' ? (
        <div className="space-y-12 animate-fade-in">
          {/* Hero Demografi */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Data Terverifikasi</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
                Demografi Penduduk Desa Dumbaya Bulan
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                Visualisasi data kependudukan komprehensif yang mencakup komposisi usia, tingkat pendidikan, mata pencaharian, dan distribusi wilayah. Instrumen penting dalam perencanaan pembangunan desa yang inklusif dan tepat sasaran di Desa Dumbaya Bulan.
              </p>
            </div>
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-xl blur-2xl transition group-hover:bg-primary/10"></div>
                <img
                  alt="Demographic Visualization"
                  className="relative w-full max-w-sm h-auto rounded-xl shadow-xl border border-outline-variant/20 transform transition duration-500 hover:scale-[1.02]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY_LyLWN1FuWwth7AALX3t8apUSM11M8zedbUeLWGdRnDhPOPQKmyFL_x3vigOBUWE5EtOQx4tsk929SLP7AB-rJKF9bgyhyRJfqccLRlhIuXMktkvuErsboNTP86bXQLCcjmQxwx5JFZJQhA87tHCsR-bJ1HgoxUf8UdCgvXaLAtYC2XBguxHMtXCKxarZjhqB9LnkWw0dHDzbjeVPGpYRS50JgRgcwhsF_6tSWJ1jz3VsFnSWgrGhPDaEi1nmYPJUwohzYbV35SU"
                />
              </div>
            </div>
          </section>

          {/* Summary Statistics Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Penduduk */}
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                </div>
                <div className="relative z-10 space-y-1">
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Penduduk</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      {demografiData?.summary?.total ? Number(demografiData.summary.total).toLocaleString('id-ID') : '1.176'}
                    </span>
                    <span className="text-sm opacity-70">Jiwa</span>
                  </div>
                </div>
              </div>

              {/* Kepala Keluarga */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      home
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                      Kepala Keluarga
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary">
                        {demografiData?.summary?.kk ? Number(demografiData.summary.kk).toLocaleString('id-ID') : '349'}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">KK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laki-laki */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      male
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                      Laki-laki
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary">
                        {demografiData?.summary?.laki ? Number(demografiData.summary.laki).toLocaleString('id-ID') : '592'}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">Jiwa</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perempuan */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      female
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                      Perempuan
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary">
                        {demografiData?.summary?.perempuan ? Number(demografiData.summary.perempuan).toLocaleString('id-ID') : '584'}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">Jiwa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Population Pyramid (Full Width) */}
            <div className="lg:col-span-12 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    Piramida Penduduk Desa Dumbaya Bulan
                  </h3>
                  <p className="text-sm text-on-surface-variant">Distribusi usia berdasarkan jenis kelamin</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span className="text-xs font-bold text-on-surface-variant">Laki-laki</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-secondary-fixed-dim rounded-full"></span>
                    <span className="text-xs font-bold text-on-surface-variant">Perempuan</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_60px_1fr] gap-3">
                {/* Male Bars */}
                <div className="flex flex-col items-end gap-3 justify-center">
                  {[
                    '61+', '56-60', '51-55', '46-50', '41-45', '36-40', 
                    '31-35', '26-30', '21-25', '16-20', '11-15', '06-10', '0-5'
                  ].map(grp => (
                    <div 
                      key={`L-${grp}`} 
                      className="h-8 bg-primary rounded-l hover:brightness-110 hover:scale-x-[1.02] transition-all cursor-pointer relative group/bar" 
                      style={{ width: getPiramidaWidth(grp, 'L') }}
                    >
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        {demografiData?.piramida?.find(p => p.label === grp)?.L ?? {
                          '0-5': 92, '06-10': 48, '11-15': 58, '16-20': 62, '21-25': 62,
                          '26-30': 52, '31-35': 30, '36-40': 40, '41-45': 38, '46-50': 29,
                          '51-55': 36, '56-60': 12, '61+': 33
                        }[grp]} Jiwa
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Age Labels */}
                <div className="flex flex-col items-center gap-3 justify-center">
                  {[
                    '61+', '56-60', '51-55', '46-50', '41-45', '36-40', 
                    '31-35', '26-30', '21-25', '16-20', '11-15', '06-10', '0-5'
                  ].map(grp => (
                    <div key={`lbl-${grp}`} className="h-8 flex items-center justify-center text-xs font-extrabold text-on-surface-variant">
                      {grp}
                    </div>
                  ))}
                </div>

                {/* Female Bars */}
                <div className="flex flex-col items-start gap-3 justify-center">
                  {[
                    '61+', '56-60', '51-55', '46-50', '41-45', '36-40', 
                    '31-35', '26-30', '21-25', '16-20', '11-15', '06-10', '0-5'
                  ].map(grp => (
                    <div 
                      key={`P-${grp}`} 
                      className="h-8 bg-secondary-fixed-dim rounded-r hover:brightness-110 hover:scale-x-[1.02] transition-all cursor-pointer relative group/bar" 
                      style={{ width: getPiramidaWidth(grp, 'P') }}
                    >
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        {demografiData?.piramida?.find(p => p.label === grp)?.P ?? {
                          '0-5': 91, '06-10': 48, '11-15': 58, '16-20': 62, '21-25': 61,
                          '26-30': 52, '31-35': 29, '36-40': 39, '41-45': 37, '46-50': 29,
                          '51-55': 35, '56-60': 11, '61+': 32
                        }[grp]} Jiwa
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-surface rounded-xl border-l-4 border-primary flex items-start gap-4 shadow-sm">
                <span className="material-symbols-outlined text-primary text-xl">info</span>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Kelompok umur anak-anak (<span className="font-bold text-primary">0-5 tahun</span>) mendominasi demografi Desa Dumbaya Bulan dengan kontribusi sebesar <span className="font-bold text-primary">15.56%</span> dari total populasi.
                </p>
              </div>
            </div>

            {/* Dusun Pie Chart */}
            <div className="lg:col-span-5 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <h3 className="text-lg font-bold text-primary mb-6">
                Distribusi Dusun Desa Dumbaya Bulan
              </h3>
              <div className="flex-grow flex flex-col items-center justify-center gap-8">
                <div 
                  className="w-48 h-48 rounded-full relative shadow-inner flex items-center justify-center animate-pulse-glow"
                  style={{
                    background: getDusunConicGradient(),
                  }}
                >
                  <div className="w-28 h-28 bg-white rounded-full shadow-lg flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-primary">3</span>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Dusun</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center p-2.5 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#0d522c]"></span>
                      <span className="text-sm font-semibold">Buwoto</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {demografiData?.dusun?.find(d => d.nama === 'Buwoto')?.count ? Number(demografiData.dusun.find(d => d.nama === 'Buwoto').count).toLocaleString('id-ID') : '529'}{' '}
                      <span className="text-xs font-normal opacity-70">Jiwa</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#258a4f]"></span>
                      <span className="text-sm font-semibold">Dilipoga</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {demografiData?.dusun?.find(d => d.nama === 'Dilipoga')?.count ? Number(demografiData.dusun.find(d => d.nama === 'Dilipoga').count).toLocaleString('id-ID') : '357'}{' '}
                      <span className="text-xs font-normal opacity-70">Jiwa</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#a9ddb9]"></span>
                      <span className="text-sm font-semibold">Tapalu</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {demografiData?.dusun?.find(d => d.nama === 'Tapalu')?.count ? Number(demografiData.dusun.find(d => d.nama === 'Tapalu').count).toLocaleString('id-ID') : '290'}{' '}
                      <span className="text-xs font-normal opacity-70">Jiwa</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pendidikan Bar Chart */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <h3 className="text-lg font-bold text-primary mb-8">
                Tingkat Pendidikan Desa Dumbaya Bulan
              </h3>
              
              <div className="flex items-end justify-between h-64 gap-3 pb-2">
                {['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'Sarjana'].map((lbl) => {
                  const val = getPendidikanValue(lbl);
                  const isMax = demografiData && demografiData.pendidikan
                    ? val === Math.max(...demografiData.pendidikan.map(p => p.value))
                    : lbl === 'SMP';
                  
                  return (
                    <div key={lbl} className="flex flex-col items-center flex-1 gap-4 group cursor-pointer">
                      <div 
                        className={`w-full rounded-xl relative transition-all duration-300 ${
                          isMax 
                            ? 'bg-primary animate-pulse-glow' 
                            : 'bg-surface-container-high group-hover:bg-primary-fixed'
                        }`}
                        style={{ height: getPendidikanHeight(lbl) }}
                      >
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity duration-200 ${
                          isMax ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {val}
                        </div>
                      </div>
                      <span className={`text-[10px] text-center font-bold px-1 leading-tight h-10 flex items-center justify-center ${
                        isMax ? 'text-primary font-black' : 'text-on-surface-variant'
                      }`}>
                        {lbl}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pekerjaan Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">
                Mata Pencaharian Desa Dumbaya Bulan
              </h3>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-4 py-1.5 rounded-full uppercase tracking-wider">
                Top 6 Kategori
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Ibu Rumah Tangga', 'Belum/Tidak Bekerja', 'Pelajar/Mahasiswa', 'Nelayan/Perikanan', 'Petani/Pekebun', 'Buruh Harian Lepas'].map((lbl) => {
                const count = getPekerjaanCount(lbl);
                const width = getPekerjaanWidth(lbl);
                return (
                  <div key={lbl} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:border-primary transition-all group cursor-pointer shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                        {lbl}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-primary">{count}</span>
                        <span className="text-xs opacity-60">Jiwa</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full group-hover:bg-primary-fixed-dim transition-all duration-700 animate-pulse-glow"
                        style={{ width: width }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Agama Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">
              Data Keagamaan Desa Dumbaya Bulan
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center group hover:bg-primary transition-all duration-300 cursor-pointer shadow-sm">
                <div className="w-14 h-14 mb-4 rounded-xl bg-primary-fixed text-primary group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-3xl">mosque</span>
                </div>
                <span className="text-2xl font-extrabold text-primary group-hover:text-white transition-colors">
                  {demografiData?.summary?.total ? Number(demografiData.summary.total).toLocaleString('id-ID') : '1.429'}
                </span>
                <span className="text-xs font-bold text-on-surface-variant group-hover:text-white/80 transition-colors uppercase tracking-wider mt-1">
                  Islam
                </span>
              </div>

              {['Kristen', 'Hindu', 'Buddha'].map((rel) => (
                <div key={rel} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 text-center flex flex-col items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer shadow-sm">
                  <div className="w-14 h-14 mb-4 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl">
                      {rel === 'Kristen' ? 'church' : rel === 'Hindu' ? 'temple_hindu' : 'temple_buddhist'}
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-primary">0</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">
                    {rel}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : activeSubTab === 'apbdes' ? (
        <div className="space-y-12 animate-fade-in">
          {/* APB Desa Header / Filters */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-secondary rounded-full"></span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-secondary">
                  APB Desa Dumbaya Bulan
                </h4>
              </div>
              <p className="text-on-surface-variant text-sm md:text-base max-w-2xl leading-relaxed">
                Transparansi Anggaran Pendapatan dan Belanja Desa (APBDes) untuk mewujudkan tata kelola keuangan yang akuntabel.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary flex items-center">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
              </div>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 bg-white border border-outline-variant/50 rounded-xl pl-11 pr-10 text-on-surface focus:ring-2 focus:ring-primary appearance-none font-bold text-sm shadow-sm cursor-pointer"
              >
                <option value="2024">Tahun Anggaran 2024</option>
                <option value="2023">Tahun Anggaran 2023</option>
                <option value="2022">Tahun Anggaran 2022</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl">
                expand_more
              </span>
            </div>
          </section>

          {/* Financial Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pendapatan Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-outline-variant/20 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -mr-6 -mt-6"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl font-bold">trending_up</span>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {apbdesData ? ((apbdesData.pendapatan_realisasi / apbdesData.pendapatan_target) * 100).toFixed(1) : '85.3'}%
                </span>
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Total Pendapatan</h5>
              <p className="text-2xl md:text-3xl font-black text-primary mb-6">
                Rp {apbdesData ? Number(apbdesData.pendapatan_realisasi).toLocaleString('id-ID') : '1.450.000.000'}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant font-medium">Realisasi</span>
                  <span className="text-primary">
                    Rp {apbdesData ? (apbdesData.pendapatan_realisasi / 1000000000).toFixed(2) : '1,45'} M
                  </span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className="bg-primary h-full rounded-full animate-pulse-glow"
                    style={{ width: `${apbdesData ? (apbdesData.pendapatan_realisasi / apbdesData.pendapatan_target) * 100 : 85}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>Target Anggaran</span>
                  <span className="text-on-surface font-semibold">
                    Rp {apbdesData ? (apbdesData.pendapatan_target / 1000000000).toFixed(2) : '1,70'} M
                  </span>
                </div>
              </div>
            </div>

            {/* Belanja Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-outline-variant/20 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-[100px] -mr-6 -mt-6"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 bg-error/10 rounded-lg flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl font-bold">payments</span>
                </div>
                <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full">
                  {apbdesData ? ((apbdesData.belanja_realisasi / apbdesData.belanja_pagu) * 100).toFixed(1) : '70.6'}%
                </span>
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Total Belanja</h5>
              <p className="text-2xl md:text-3xl font-black text-error mb-6">
                Rp {apbdesData ? Number(apbdesData.belanja_realisasi).toLocaleString('id-ID') : '1.200.000.000'}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant font-medium">Realisasi</span>
                  <span className="text-error">
                    Rp {apbdesData ? (apbdesData.belanja_realisasi / 1000000000).toFixed(2) : '1,20'} M
                  </span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className="bg-error h-full rounded-full shadow-[0_0_8px_rgba(186,26,26,0.3)]"
                    style={{ width: `${apbdesData ? (apbdesData.belanja_realisasi / apbdesData.belanja_pagu) * 100 : 70}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>Pagu Anggaran</span>
                  <span className="text-on-surface font-semibold">
                    Rp {apbdesData ? (apbdesData.belanja_pagu / 1000000000).toFixed(2) : '1,70'} M
                  </span>
                </div>
              </div>
            </div>

            {/* Surplus/Defisit and Financing */}
            <div className="flex flex-col gap-4">
              <div className="bg-primary-container rounded-xl p-6 text-on-primary shadow-lg flex-1 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Surplus Keuangan</span>
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-fixed text-xl">account_balance</span>
                    </div>
                  </div>
                  <p className="text-3xl font-black leading-none mb-2 text-white">
                    {(() => {
                      const real = apbdesData ? apbdesData.pendapatan_realisasi : 1450000000;
                      const bel = apbdesData ? apbdesData.belanja_realisasi : 1200000000;
                      const surplus = real - bel;
                      return (surplus >= 0 ? '+ ' : '- ') + 'Rp ' + Math.abs(surplus).toLocaleString('id-ID');
                    })()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs bg-white/10 p-2.5 rounded-lg border border-white/10 z-10">
                  <span className="material-symbols-outlined text-sm text-green-400">verified</span>
                  <p className="font-semibold text-white/95">Kondisi Keuangan Desa Sangat Stabil</p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 grid grid-cols-2 gap-4 shadow-sm">
                <div className="border-r border-outline-variant/30 pr-2">
                  <p className="text-[9px] uppercase font-extrabold text-outline mb-1 leading-none">Penerimaan Pembiayaan</p>
                  <p className="text-base font-black text-primary">
                    Rp {apbdesData ? Number(apbdesData.pembiayaan_penerimaan).toLocaleString('id-ID') : '45.000.000'}
                  </p>
                </div>
                <div className="pl-2">
                  <p className="text-[9px] uppercase font-extrabold text-outline mb-1 leading-none">Pengeluaran Pembiayaan</p>
                  <p className="text-base font-black text-error">
                    Rp {apbdesData ? Number(apbdesData.pembiayaan_pengeluaran).toLocaleString('id-ID') : '0'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : activeSubTab === 'stunting' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card */}
          <div className="bg-[#1a7041] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative space-y-4">
              <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-teal-300 text-3xl font-bold">child_care</span>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold">Pemantauan & Intervensi Stunting</h4>
                    <p className="text-xs text-white/60">Data tumbuh kembang balita Desa Dumbaya Bulan</p>
                  </div>
                </div>
                {/* Year Selector */}
                <div className="relative w-full md:w-56 shrink-0">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-lg">calendar_today</span>
                  <select
                    value={stuntingYear}
                    onChange={(e) => setStuntingYear(e.target.value)}
                    className="w-full h-11 bg-white/10 border border-white/20 rounded-xl pl-10 pr-8 text-white font-bold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    <option value="2024" className="text-on-surface">Tahun 2024</option>
                    <option value="2023" className="text-on-surface">Tahun 2023</option>
                    <option value="2022" className="text-on-surface">Tahun 2022</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/70 text-lg">expand_more</span>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                Program pencegahan stunting melalui pemantauan gizi terpadu, posyandu rutin, dan pemberian makanan tambahan untuk memastikan tumbuh kembang optimal generasi penerus desa.
              </p>
            </div>
          </div>

          {stuntingData && (
            <>
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Balita Diperiksa</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">{stuntingData.total_balita}</span>
                    <span className="text-xs font-medium text-on-surface-variant">Anak</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Status Normal</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-green-600">{stuntingData.balita_normal}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {((stuntingData.balita_normal / stuntingData.total_balita) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Indikasi Stunting</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-600">{stuntingData.balita_stunting}</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {((stuntingData.balita_stunting / stuntingData.total_balita) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Gizi Buruk</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-600">{stuntingData.balita_gizi_buruk}</span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {((stuntingData.balita_gizi_buruk / stuntingData.total_balita) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Dusun Breakdown & Age Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
                  <div>
                    <h5 className="font-bold text-base text-primary mb-1">Penyebaran Kasus per Dusun</h5>
                    <p className="text-xs text-on-surface-variant">Sebaran jumlah kasus terindikasi stunting</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Dusun Pantai', count: stuntingData.kasus_pantai },
                      { name: 'Dusun Kampung Baru', count: stuntingData.kasus_kampung_baru },
                      { name: 'Dusun Pemukiman', count: stuntingData.kasus_pemukiman },
                    ].map((d, idx) => {
                      const totalKasus = stuntingData.balita_stunting + stuntingData.balita_gizi_buruk;
                      const percentage = totalKasus > 0 ? (d.count / totalKasus) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-on-surface-variant font-medium">{d.name}</span>
                            <span className="text-primary">{d.count} Kasus ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-teal-500 h-full rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20">
                    <h5 className="font-bold text-base text-primary mb-4">Distribusi Status Gizi Berdasarkan Kelompok Usia</h5>
                    <div className="space-y-3">
                      {[
                        { label: '0-12 Bulan', normal: stuntingData.umur_0_12_normal, stunting: stuntingData.umur_0_12_stunting },
                        { label: '13-24 Bulan', normal: stuntingData.umur_13_24_normal, stunting: stuntingData.umur_13_24_stunting },
                        { label: '25-36 Bulan', normal: stuntingData.umur_25_36_normal, stunting: stuntingData.umur_25_36_stunting },
                        { label: '37-60 Bulan', normal: stuntingData.umur_37_60_normal, stunting: stuntingData.umur_37_60_stunting },
                      ].map((age, idx) => {
                        const total = age.normal + age.stunting;
                        const normalPct = total > 0 ? (age.normal / total) * 100 : 100;
                        const stuntingPct = total > 0 ? (age.stunting / total) * 100 : 0;
                        return (
                          <div key={idx} className="flex items-center gap-4">
                            <span className="text-xs font-bold text-on-surface-variant w-24 block shrink-0">{age.label}</span>
                            <div className="flex-1 bg-surface-container h-5 rounded-md overflow-hidden flex text-[10px] font-black text-white">
                              {normalPct > 0 && (
                                <div className="bg-green-500 flex items-center justify-center px-1" style={{ width: `${normalPct}%` }}>
                                  {normalPct > 15 ? `${normalPct.toFixed(0)}% Normal` : ''}
                                </div>
                              )}
                              {stuntingPct > 0 && (
                                <div className="bg-amber-500 flex items-center justify-center px-1" style={{ width: `${stuntingPct}%` }}>
                                  {stuntingPct > 15 ? `${stuntingPct.toFixed(0)}% Rawan` : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Dynamic Annual Trend Bar Chart — responsive */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                  <div>
                    <h5 className="font-bold text-base text-primary mb-1">Tren Prevalensi Stunting Tahunan</h5>
                    <p className="text-xs text-on-surface-variant">Jumlah balita terindikasi stunting dari data nyata per tahun</p>
                  </div>

                  {allStuntingData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-outline py-10 gap-2">
                      <span className="material-symbols-outlined text-4xl text-outline/40">bar_chart</span>
                      <p className="text-xs text-center">Data tren belum tersedia</p>
                    </div>
                  ) : (
                    <>
                      {/* Scrollable bar chart — each bar min 56px so it never squishes */}
                      <div className="overflow-x-auto pb-2">
                        <div
                          className="flex items-end gap-3 h-52 pt-8"
                          style={{ minWidth: `${allStuntingData.length * 72}px` }}
                        >
                          {(() => {
                            const maxVal = Math.max(...allStuntingData.map(r => r.balita_stunting), 1);
                            const colors = ['bg-slate-400','bg-slate-500','bg-teal-400','bg-primary','bg-teal-600','bg-emerald-400','bg-sky-400','bg-indigo-400'];
                            return allStuntingData.map((r, idx) => {
                              const isLatest = idx === allStuntingData.length - 1;
                              const heightPx = Math.max(16, Math.round((r.balita_stunting / maxVal) * 148));
                              const pct = r.total_balita > 0
                                ? ((r.balita_stunting / r.total_balita) * 100).toFixed(1)
                                : '0';
                              return (
                                <div key={r.tahun} className="flex flex-col items-center gap-1 group flex-1 min-w-[56px]">
                                  {/* Tooltip-style label above bar */}
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-primary group-hover:scale-110 transition-transform leading-tight text-center">
                                      {r.balita_stunting}
                                    </span>
                                    <span className="text-[9px] text-outline leading-tight">{pct}%</span>
                                  </div>
                                  {/* Bar */}
                                  <div
                                    className={`w-8 rounded-t-lg transition-all duration-500 ${isLatest ? 'bg-teal-500 ring-2 ring-teal-300' : colors[idx % colors.length]}`}
                                    style={{ height: `${heightPx}px` }}
                                  ></div>
                                  {/* Year label */}
                                  <span className="text-[10px] font-bold text-on-surface-variant leading-tight text-center pt-0.5">
                                    {r.tahun}
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Scroll hint for many records */}
                      {allStuntingData.length > 5 && (
                        <p className="text-[10px] text-outline text-right flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-sm">swipe_right</span>
                          Geser untuk melihat semua tahun
                        </p>
                      )}

                      {/* Insight text */}
                      {allStuntingData.length >= 2 && (() => {
                        const first = allStuntingData[0];
                        const last = allStuntingData[allStuntingData.length - 1];
                        const change = first.balita_stunting > 0
                          ? (((first.balita_stunting - last.balita_stunting) / first.balita_stunting) * 100).toFixed(0)
                          : null;
                        const turun = last.balita_stunting <= first.balita_stunting;
                        return (
                          <div className="bg-primary/5 p-3 rounded-xl flex items-start gap-2 mt-auto">
                            <span className={`material-symbols-outlined text-lg shrink-0 ${turun ? 'text-teal-600' : 'text-amber-600'}`}>
                              {turun ? 'trending_down' : 'trending_up'}
                            </span>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {change !== null
                                ? turun
                                  ? `Prevalensi stunting ${change}% lebih rendah vs ${first.tahun} berkat program gizi PMT yang intensif.`
                                  : `Terjadi peningkatan ${Math.abs(change)}% kasus stunting dari ${first.tahun}. Perlu penguatan program intervensi gizi.`
                                : 'Data tren menunjukkan perkembangan kondisi gizi balita dari tahun ke tahun.'}
                            </p>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : activeSubTab === 'bansos' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Banner */}
          <div className="bg-primary-container rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-fixed text-4xl">badge</span>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-black">Infografis Bansos Desa Dumbaya Bulan</h4>
                  <p className="text-xs text-white/60 font-medium">Data Penerima Bantuan Sosial</p>
                </div>
              </div>
              
              <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                Ringkasan jumlah Keluarga Penerima Manfaat (KPM) yang terdaftar dalam program bantuan sosial di Desa Dumbaya Bulan. Data diperbarui secara berkala oleh Pemerintah Desa.
              </p>

              {/* KPM Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'PKH',
                    fullName: 'Program Keluarga Harapan',
                    count: bansosStats?.pkh ?? 24,
                    icon: 'family_restroom',
                    color: 'from-blue-400/30 to-blue-600/30 border-blue-400/30',
                    iconColor: 'text-blue-200',
                  },
                  {
                    label: 'BPNT',
                    fullName: 'Bantuan Pangan Non Tunai',
                    count: bansosStats?.bpnt ?? 47,
                    icon: 'grocery',
                    color: 'from-green-400/30 to-green-600/30 border-green-400/30',
                    iconColor: 'text-green-200',
                  },
                  {
                    label: 'BLT Dana Desa',
                    fullName: 'Bantuan Langsung Tunai',
                    count: bansosStats?.blt ?? 11,
                    icon: 'payments',
                    color: 'from-amber-400/30 to-amber-600/30 border-amber-400/30',
                    iconColor: 'text-amber-200',
                  },
                  {
                    label: 'Bulog',
                    fullName: 'Bantuan Beras BULOG',
                    count: bansosStats?.bulog ?? 101,
                    icon: 'local_shipping',
                    color: 'from-purple-400/30 to-purple-600/30 border-purple-400/30',
                    iconColor: 'text-purple-200',
                  },
                ].map((item) => (
                  <div key={item.label} className={`bg-gradient-to-br ${item.color} border rounded-xl p-5 flex flex-col gap-2 backdrop-blur-sm`}>
                    <span className={`material-symbols-outlined text-2xl ${item.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    <div>
                      <span className="text-3xl font-black text-white block leading-none">{item.count}</span>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">KPM</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{item.label}</p>
                      <p className="text-[10px] text-white/60 leading-snug">{item.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                <span className="material-symbols-outlined text-primary-fixed text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                <div>
                  <p className="text-xs text-white/60 font-bold uppercase tracking-wider">Total Penerima Bansos</p>
                  <p className="text-2xl font-black text-white">
                    {((bansosStats?.pkh ?? 24) + (bansosStats?.bpnt ?? 47) + (bansosStats?.blt ?? 11) + (bansosStats?.bulog ?? 101))} KPM
                    <span className="text-xs font-normal text-white/50 ml-2">(dari berbagai program)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cek Penerima Bansos */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>manage_search</span>
              </div>
              <div>
                <h5 className="text-lg font-bold text-primary">Cek Status Penerima Bansos</h5>
                <p className="text-xs text-on-surface-variant">Masukkan nama lengkap dan pilih dusun untuk memeriksa kepesertaan</p>
              </div>
            </div>

            <form onSubmit={handleBansosCheck} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">person</span>
                <input 
                  type="text"
                  value={namaSearch}
                  onChange={(e) => setNamaSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-6 rounded-xl bg-white text-on-background font-medium text-sm shadow-sm border border-outline-variant/30 focus:ring-2 focus:ring-primary/30 placeholder:text-outline"
                  placeholder="Masukkan Nama Lengkap Anda..."
                />
              </div>
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">distance</span>
                <select 
                  value={dusunSearch}
                  onChange={(e) => setDusunSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-10 rounded-xl bg-white text-on-background font-bold text-sm shadow-sm border border-outline-variant/30 focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                >
                  <option value="1">Dusun Buwoto</option>
                  <option value="2">Dusun Dilipoga</option>
                  <option value="3">Dusun Tapalu</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
              <button 
                type="submit"
                className="h-14 bg-primary hover:bg-primary/90 text-on-primary px-8 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">search</span>
                Cek Status
              </button>
            </form>

            {searchResult && (
              <div className="p-5 rounded-xl bg-surface border border-outline-variant/30 space-y-4 text-sm animate-fade-in shadow-sm">
                {searchResult.found ? (
                  <div className="space-y-4">
                    {searchResult.results.map((res) => (
                      <div key={res.id} className="bg-white border border-outline-variant/30 p-5 rounded-xl space-y-3 shadow-sm">
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Nama Lengkap</span>
                          <span className="font-extrabold text-base text-primary">{res.nama}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Dusun</span>
                          <span className="font-bold text-sm">{res.dusun}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Status Penerima</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            res.is_penerima ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        {res.is_penerima && (
                          <div className="space-y-2 pt-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">Detail Bantuan:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                              {[{key: 'pkh', label: 'PKH'}, {key: 'bpnt', label: 'BPNT'}, {key: 'blt', label: 'BLT'}, {key: 'bulog', label: 'Bulog'}].map(({key, label}) => (
                                <div key={key} className={`p-3 rounded-xl border font-bold flex flex-col justify-center gap-1 ${
                                  res[key] !== 'Tidak Terdaftar'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-surface-container border-outline-variant/20 text-on-surface-variant/50'
                                }`}>
                                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: res[key] !== 'Tidak Terdaftar' ? "'FILL' 1" : '' }}>
                                    {res[key] !== 'Tidak Terdaftar' ? 'check_circle' : 'cancel'}
                                  </span>
                                  <span className="font-black">{label}</span>
                                  <span className="text-[9px] uppercase font-bold opacity-70">{res[key]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <p className="text-error font-semibold leading-relaxed text-xs">{searchResult.message}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-primary-fixed/20 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary">security</span>
              <p className="text-xs font-medium text-on-surface-variant leading-tight">
                Privasi Anda terlindungi. Data hanya digunakan untuk sinkronisasi dengan database terpadu Kemensos RI.
              </p>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'idm' ? (
        <Idm />
      ) : activeSubTab === 'sdgs' ? (
        <div className="space-y-12 animate-fade-in">
          {/* SDGs Desa Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 bg-white rounded-xl p-8 md:p-10 shadow-sm border border-outline-variant/20 flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold mb-4">
                  <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
                  SDGs DESA PROGRESS
                </div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">
                  Capaian Pembangunan Berkelanjutan
                </h4>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  Upaya terpadu percepatan pencapaian tujuan pembangunan berkelanjutan di tingkat desa melalui 18 goals utama untuk kemajuan ekonomi, sosial, dan lingkungan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm group hover:border-secondary transition-all">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Skor Rata-rata Desa</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black text-primary">68.45</span>
                    <span className="text-secondary font-bold text-sm">/ 100</span>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm group hover:border-secondary transition-all">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Status Klasifikasi</p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg md:text-xl font-bold text-secondary">Berkembang</span>
                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-fit flex items-center gap-3 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all group shadow-md shadow-primary/20 cursor-pointer">
                Lihat Detail 18 Tujuan
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-secondary/10 rounded-xl -rotate-1 group-hover:rotate-0 transition-transform"></div>
              <div className="relative h-full aspect-square lg:aspect-auto min-h-[400px] overflow-hidden rounded-xl shadow-xl border-4 border-white">
                <img 
                  alt="SDGs Visual" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnechLrTBvTsMGsWbg4NDbuWxv-pBlJXzokP_bVDPm_Csjfwpkl--4fPKE9aGa1GJ-kc1RJ2KQPKydpaYOSVT2vsbx1QJbUJNnXqdGsc4JUoGSLvxaLRVrkHj0yVQRd8NfAJFUvCJw-nD0qG6S8fLljaPIBhP3sQQn3PfPe1Teug403365zBZMwcH4f_Mb89GvAn_ojC-oqxmWRO9Jz1_xZ6nnyrQvDgZZ6Joaam04E7CTTzUFoi4hp6thKMzL_lZGUffxlrTM6Iya"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/70 backdrop-blur-md rounded-lg border border-white/30">
                  <p className="text-primary font-bold flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-lg">info</span>
                    Transformasi Digital Desa
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Membangun ekosistem data desa yang transparan dan efisien.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">
            construction
          </span>
          <h2 className="text-2xl font-bold text-primary mb-2">Statistik Sedang Dibuat</h2>
          <p className="text-on-surface-variant max-w-sm text-sm">
            Statistik "{activeSubTab.toUpperCase()}" sedang disiapkan oleh bagian administrasi desa.
          </p>
        </div>
      )}
    </div>
  );
}
