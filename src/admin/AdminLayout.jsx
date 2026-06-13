import { useState } from 'react';

export default function AdminLayout({ children, setToken, activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [infografisOpen, setInfografisOpen] = useState(() =>
    ['kelola-warga', 'kelola-apbdes', 'idm', 'stunting', 'potensi', 'bansos'].includes(activeTab)
  );

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json',
        }
      });
    } catch (e) {
      console.error(e);
    }
    setToken(null);
  };

  const topNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'profil',    label: 'Profil Desa', icon: 'account_balance' },
    { id: 'peta',      label: 'Peta Wilayah', icon: 'map' },
  ];

  // Grouped: Kelola Infografis
  const infografisItems = [
    { id: 'kelola-warga',  label: 'Kelola Penduduk',    icon: 'groups' },
    { id: 'kelola-apbdes', label: 'Kelola APBDes',       icon: 'account_balance_wallet' },
    { id: 'idm',           label: 'Kelola IDM',          icon: 'bar_chart' },
    { id: 'stunting',      label: 'Kelola Stunting',     icon: 'child_care' },
    { id: 'bansos',        label: 'Kelola Bansos',        icon: 'card_giftcard' },
    { id: 'potensi',       label: 'Kelola Potensi/Wisata', icon: 'explore' },
  ];

  const bottomNavItems = [
    { id: 'kunjungan',    label: 'Kelola Kunjungan',  icon: 'door_open' },
    { id: 'berita',       label: 'Berita',             icon: 'newspaper' },
    { id: 'foto-slider',  label: 'Foto Slider',        icon: 'slideshow' },
    { id: 'sambutan',     label: 'Sambutan Kades',     icon: 'chat_bubble' },
    { id: 'galeri',       label: 'Galeri Desa',        icon: 'photo_library' },
    { id: 'pengaturan',   label: 'Pengaturan',         icon: 'settings' },
  ];

  const isInfografisActive = infografisItems.some(i => i.id === activeTab);

  const handleSetTab = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    // Auto-open group if navigating into it
    if (infografisItems.some(i => i.id === id)) setInfografisOpen(true);
  };

  const NavItem = ({ item }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleSetTab(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-sm relative group ${
          isActive
            ? 'bg-white/10 text-white font-bold shadow-sm'
            : 'text-white/65 hover:bg-white/5 hover:text-white'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary-fixed rounded-r-full" />
        )}
        <span className={`material-symbols-outlined text-[20px] transition-colors ${
          isActive ? 'text-primary-fixed-dim' : 'text-white/50 group-hover:text-white/80'
        }`}>
          {item.icon}
        </span>
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col md:flex-row font-sans text-on-surface">

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-primary text-on-primary p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          Admin Portal
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="cursor-pointer">
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 bottom-0 left-0 z-40
        w-[280px] md:w-64 bg-[#020f09] text-white flex-shrink-0
        flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        h-screen
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
              <img src="/logoo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Portal Admin</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

          {/* Top items */}
          {topNavItems.map(item => <NavItem key={item.id} item={item} />)}

          {/* ── Kelola Infografis Group ── */}
          <div className="pt-2">
            {/* Group Header / Toggle */}
            <button
              onClick={() => setInfografisOpen(p => !p)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isInfografisActive
                  ? 'text-primary-fixed-dim bg-white/5'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isInfografisActive ? 'text-primary-fixed-dim' : 'text-white/40'}`}>
                  insert_chart
                </span>
                <span>Kelola Infografis</span>
              </div>
              <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${infografisOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Collapsible sub-items */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${infografisOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pl-3 pt-1 space-y-0.5 border-l border-white/10 ml-5 mt-1">
                {infografisItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSetTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer relative group ${
                        isActive
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-white/55 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary-fixed rounded-r-full" />
                      )}
                      <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary-fixed-dim' : 'text-white/40 group-hover:text-white/70'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom items */}
          <div className="pt-1 space-y-1">
            {bottomNavItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-black flex items-center justify-center flex-shrink-0 text-sm">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Admin Desa</p>
              <p className="text-[10px] text-white/50 truncate font-bold uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer flex-shrink-0"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="hidden md:flex bg-white h-16 items-center justify-between px-8 border-b border-outline-variant shadow-sm z-10">
          <h2 className="text-lg font-bold text-primary capitalize tracking-tight">
            {[...topNavItems, ...infografisItems, ...bottomNavItems].find(i => i.id === activeTab)?.label || activeTab}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">Admin Desa</p>
              <p className="text-xs text-on-surface-variant">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface">
          {children}
        </div>
      </main>

    </div>
  );
}
